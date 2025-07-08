<?php

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use App\Models\Product;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xls;
use Exception;

class ProductExportController extends Controller
{
    public function export()
    {
        $products = Product::with(['category', 'unit'])->orderBy('name')->get();

        $product_array = [[
            'Product Name',
            'Category',
            'Unit',
            'Product Code',
            'Stock',
            'Buying Price',
            'Selling Price',
            'Tax',
            'Tax Type',
            'Product Image',
            'Notes'
        ]];

        foreach ($products as $product) {
            $taxType = 'Unknown';
            try {
                if (class_exists('\App\Enums\TaxType')) {
                     if ($product->tax_type instanceof \App\Enums\TaxType) {
                        $taxType = $product->tax_type->label();
                    } else {
                        $taxTypeEnum = \App\Enums\TaxType::from((int)$product->tax_type);
                        $taxType = $taxTypeEnum->label();
                    }
                }
            } catch (\Throwable $e) {
                \Log::debug($e);
                // leave as 'Unknown'
            }
            $product_array[] = [
                $product->name,
                optional($product->category)->name ?? $product->category_id,
                optional($product->unit)->name ?? $product->unit_id,
                $product->code,
                $product->quantity,
                $product->buying_price,
                $product->selling_price,
                $product->tax,
                $taxType,
                $product->product_image,
                $product->notes,
            ];
        }
        \Log::info('Exporting products', ['product_array' => $product_array]);
        return $this->downloadExcel($product_array);
    }

    protected function downloadExcel(array $products)
    {
        ini_set('max_execution_time', 0);
        ini_set('memory_limit', '4000M');

        try {
            $spreadsheet = new Spreadsheet();
            $sheet = $spreadsheet->getActiveSheet();
            $sheet->getDefaultColumnDimension()->setWidth(20);
            $sheet->fromArray($products);

            $writer = new Xls($spreadsheet);

            return response()->streamDownload(function () use ($writer) {
                $writer->save('php://output');
            }, 'products.xls', [
                'Content-Type' => 'application/vnd.ms-excel',
                'Cache-Control' => 'max-age=0',
            ]);
        } catch (Exception $e) {
            \Log::error($e);
            return response()->json(['error' => 'Failed to export products.'], 500);
        }
    }
}