<?php

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use App\Models\Unit;
use App\Enums\TaxType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use PhpOffice\PhpSpreadsheet\IOFactory;
use Exception;

class ProductImportController extends Controller
{
    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xls,xlsx'
        ]);

        $file = $request->file('file');

        try {
            $spreadsheet = IOFactory::load($file->getRealPath());
            $sheet = $spreadsheet->getActiveSheet();
            $rows = $sheet->toArray();

            // Assume first row is header
            $header = array_map('trim', $rows[0]);
            $header = array_map('strtolower', $header);

            $map = [
                'product name'   => 'name',
                'category'       => 'category',
                'unit'           => 'unit',
                'product code'   => 'code',
                'stock'          => 'quantity',
                'buying price'   => 'buying_price',
                'selling price'  => 'selling_price',
                'tax'            => 'tax',
                'tax type'       => 'tax_type',
                'product image'  => 'product_image',
                'notes'          => 'notes',
            ];

            $productsToInsert = [];
            $importedCount = 0;
            $errors = [];
            foreach (array_slice($rows, 1) as $rowIndex => $row) {
                if (count(array_filter($row)) === 0) continue;
                try {
                    $data = [];
                    foreach ($header as $i => $col) {
                        if (isset($map[$col]) && isset($row[$i])) {
                            $data[$map[$col]] = $row[$i];
                        }
                    }

                    if (empty($data['name']) || empty($data['code'])) {
                        continue;
                    }

                    $data['slug'] = Str::slug($data['name']);

                    if (!empty($data['category'])) {
                        $category = Category::firstOrCreate(['name' => trim($data['category'])]);
                        $data['category_id'] = $category->id;
                    }

                    if (!empty($data['unit'])) {
                        $unit = Unit::firstOrCreate(['name' => trim($data['unit'])]);
                        $data['unit_id'] = $unit->id;
                    }

                    if (isset($data['tax_type'])) {
                        if (is_numeric($data['tax_type'])) {
                            $taxType = (int)$data['tax_type'];
                        } else {
                            $taxType = null;
                            foreach (TaxType::cases() as $case) {
                                if (strcasecmp($case->label(), trim($data['tax_type'])) === 0) {
                                    $taxType = $case->value;
                                    break;
                                }
                            }
                            if ($taxType === null) {
                                $taxType = TaxType::EXCLUSIVE->value;
                            }
                        }
                        $data['tax_type'] = $taxType;
                    } else {
                        $data['tax_type'] = TaxType::EXCLUSIVE->value;
                    }

                    unset($data['category'], $data['unit']);

                    $data['quantity'] = isset($data['quantity']) ? (int)$data['quantity'] : 0;
                    $data['quantity_alert'] = $data['quantity_alert'] ?? 0;
                    $data['buying_price'] = isset($data['buying_price']) ? (float)$data['buying_price'] : 0;
                    $data['selling_price'] = isset($data['selling_price']) ? (float)$data['selling_price'] : 0;
                    $data['tax'] = isset($data['tax']) ? (float)$data['tax'] : 0;
                    $data['notes'] = $data['notes'] ?? null;

                    if (isset($data['product_image']) && !empty($data['product_image'])) {
                        $data['product_image'] = basename($data['product_image']);
                    } else {
                        $data['product_image'] = null;
                    }

                    $productsToInsert[] = $data;

                } catch (Exception $e) {
                    $errors[] = "Row " . ($rowIndex + 2) . ": " . $e->getMessage();
                    Log::error("Import row error: " . $e->getMessage(), ['row' => $rowIndex + 2, 'data' => $row]);
                }
            }
            \Log::debug($productsToInsert);

            foreach ($productsToInsert as $data) {
                try {
                    Product::updateOrCreate(
                        ['code' => $data['code']],
                        $data
                    );
                    $importedCount++;
                } catch (Exception $e) {
                    $errors[] = "Product {$data['code']}: " . $e->getMessage();
                    Log::error("Product import error: " . $e->getMessage(), ['product_data' => $data]);
                }
            }

            $response = [
                'message' => "Products imported successfully. {$importedCount} products processed.",
                'imported_count' => $importedCount,
            ];

            if (!empty($errors)) {
                $response['errors'] = $errors;
                $response['message'] .= " " . count($errors) . " errors occurred.";
            }

            return response()->json($response);

        } catch (Exception $e) {
            Log::error('Import products failed: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to import products: ' . $e->getMessage()
            ], 500);
        }
    }
}