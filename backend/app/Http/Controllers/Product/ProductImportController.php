<?php
 
namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use App\Models\Unit;
use App\Enums\TaxType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use PhpOffice\PhpSpreadsheet\IOFactory;
use Exception;
use App\Models\UserActivityLog;
class ProductImportController extends Controller
{
    /**
     * Parse and preview the import file.
     * Returns per-row status: success (can import), skipped (missing/duplicate), error (parsing error)
     */
    public function preview(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xls,xlsx'
        ]);
        $file = $request->file('file');

        try {
            $spreadsheet = IOFactory::load($file->getRealPath());
            $sheet = $spreadsheet->getActiveSheet();
            $rows = $sheet->toArray();

            // Header mapping
            $header = array_map('trim', $rows[0]);
            $header = array_map('strtolower', $header);

            $map = [
                'product name'   => 'name',
                'category'       => 'category',
                'unit'           => 'unit',
                'product code'   => 'code',
                'quantity alert' => 'quantity_alert',
                'buying price'   => 'buying_price',
                'selling price'  => 'selling_price',
                'tax'            => 'tax',
                'tax type'       => 'tax_type',
                'product image'  => 'product_image',
                'notes'          => 'notes',
            ];

            $successList = [];
            $skippedList = [];
            $errorList = [];
            $productsToInsert = [];

            foreach (array_slice($rows, 1) as $rowIndex => $row) {
                $rowNumber = $rowIndex + 2; // Excel-style row number
                if (count(array_filter($row)) === 0) {
                    $skippedList[] = [
                        'row' => $rowNumber,
                        'name' => null,
                        'code' => null,
                        'reason' => 'Empty row'
                    ];
                    continue;
                }
                try {
                    $data = [];
                    foreach ($header as $i => $col) {
                        if (isset($map[$col]) && isset($row[$i])) {
                            $data[$map[$col]] = $row[$i];
                        }
                    }

                    $pname = trim($data['name'] ?? '');
                    $pcode = trim($data['code'] ?? '');

                    // Extended error checking
                    $reasons = [];

                    if ($pname === '') $reasons[] = 'Missing product name';
                    elseif (mb_strlen($pname) > 50) $reasons[] = 'Product name too long (max 50)';

                    if ($pcode === '') $reasons[] = 'Missing product code';
                    elseif (mb_strlen($pcode) > 20) $reasons[] = 'Product code too long (max 20)';

                    // Check duplicate code
                    if ($pcode && Product::where('code', $pcode)->exists()) {
                        $reasons[] = "Product code '{$pcode}' already exists";
                    }

                    // Category
                    $categoryName = trim($data['category'] ?? '');
                    if ($categoryName === '') $reasons[] = 'Missing category';
                    elseif (!Category::where('name', $categoryName)->exists()) $reasons[] = "Category '{$categoryName}' does not exist";

                    // Unit
                    $unitName = trim($data['unit'] ?? '');
                    if ($unitName === '') $reasons[] = 'Missing unit';
                    elseif (!Unit::where('name', $unitName)->exists()) $reasons[] = "Unit '{$unitName}' does not exist";

                    // Buying price
                    $buying_price = $data['buying_price'] ?? '';
                    if ($buying_price === '' || !is_numeric($buying_price) || intval($buying_price) < 0) {
                        $reasons[] = 'Buying price required, integer, min 0';
                    }

                    // Selling price
                    $selling_price = $data['selling_price'] ?? '';
                    if ($selling_price === '' || !is_numeric($selling_price) || intval($selling_price) < 0) {
                        $reasons[] = 'Selling price required, integer, min 0';
                    }

                    // Tax
                    if (isset($data['tax']) && $data['tax'] !== '') {
                        if (!is_numeric($data['tax']) || $data['tax'] < 0 || $data['tax'] > 99999999.99) {
                            $reasons[] = 'Tax must be between 0 and 99999999.99';
                        }
                    }

                    // Tax type
                    if (isset($data['tax_type']) && $data['tax_type'] !== '') {
                        if (mb_strlen($data['tax_type']) > 20) $reasons[] = 'Tax type too long (max 20)';
                    }

                    // Notes
                    if (isset($data['notes']) && !is_null($data['notes']) && !is_string($data['notes'])) {
                        $reasons[] = 'Notes must be a string';
                    }

                    // Product image (filename length check)
                    if (isset($data['product_image']) && mb_strlen($data['product_image']) > 255) {
                        $reasons[] = 'Product image filename too long';
                    }

                    if (count($reasons) > 0) {
                        $skippedList[] = [
                            'row' => $rowNumber,
                            'name' => $pname ?: null,
                            'code' => $pcode ?: null,
                            'reason' => implode('; ', $reasons)
                        ];
                        continue;
                    }

                    $successList[] = [
                        'row' => $rowNumber,
                        'name' => $pname,
                        'code' => $pcode,
                    ];

                    // Save for possible import
                    $productsToInsert[] = [
                        'data' => $data,
                        'row' => $rowNumber,
                        'name' => $pname,
                        'code' => $pcode
                    ];

                } catch (Exception $e) {
                    $errorList[] = [
                        'row' => $rowNumber,
                        'name' => $data['name'] ?? null,
                        'code' => $data['code'] ?? null,
                        'error' => $e->getMessage()
                    ];
                    Log::error("Import row error: " . $e->getMessage(), ['row' => $rowNumber, 'data' => $row]);
                }
            }

            return response()->json([
                'message' => "Preview complete. Success: " . count($successList) . ", Skipped: " . count($skippedList) . ", Errors: " . count($errorList) . ".",
                'success' => $successList,
                'skipped' => $skippedList,
                'errors' => $errorList,
                'to_import' => $productsToInsert,
            ]);
        } catch (Exception $e) {
            Log::error('Preview products failed: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to preview products: ' . $e->getMessage()
            ], 500);
        }
    }
    public function confirm(Request $request)
{
    $request->validate([
        'file' => 'required|file|mimes:xls,xlsx'
    ]);
    $file = $request->file('file');

    try {
        $spreadsheet = IOFactory::load($file->getRealPath());
        $sheet = $spreadsheet->getActiveSheet();
        $rows = $sheet->toArray();

        // Header mapping
        $header = array_map('trim', $rows[0]);
        $header = array_map('strtolower', $header);

        $map = [
            'product name'   => 'name',
            'category'       => 'category',
            'unit'           => 'unit',
            'product code'   => 'code',
            'quantity alert' => 'quantity_alert',
            'buying price'   => 'buying_price',
            'selling price'  => 'selling_price',
            'tax'            => 'tax',
            'tax type'       => 'tax_type',
            'product image'  => 'product_image',
            'notes'          => 'notes',
        ];

        $successList = [];
        $skippedList = [];
        $errorList = [];
        $importedProducts = [];

        foreach (array_slice($rows, 1) as $rowIndex => $row) {
            $rowNumber = $rowIndex + 2; // Excel-style row number
            if (count(array_filter($row)) === 0) {
                $skippedList[] = [
                    'row' => $rowNumber,
                    'name' => null,
                    'code' => null,
                    'reason' => 'Empty row'
                ];
                continue;
            }
            try {
                $data = [];
                foreach ($header as $i => $col) {
                    if (isset($map[$col]) && isset($row[$i])) {
                        $data[$map[$col]] = $row[$i];
                    }
                }

                $pname = trim($data['name'] ?? '');
                $pcode = trim($data['code'] ?? '');

                // Extended error checking
                $reasons = [];

                if ($pname === '') $reasons[] = 'Missing product name';
                elseif (mb_strlen($pname) > 50) $reasons[] = 'Product name too long (max 50)';

                if ($pcode === '') $reasons[] = 'Missing product code';
                elseif (mb_strlen($pcode) > 20) $reasons[] = 'Product code too long (max 20)';

                // Check duplicate code
                if ($pcode && Product::where('code', $pcode)->exists()) {
                    $reasons[] = "Product code '{$pcode}' already exists";
                }

                // Category
                $categoryName = trim($data['category'] ?? '');
                $category = null;
                if ($categoryName === '') {
                    $reasons[] = 'Missing category';
                } else {
                    $category = Category::where('name', $categoryName)->first();
                    if (!$category) $reasons[] = "Category '{$categoryName}' does not exist";
                }

                // Unit
                $unitName = trim($data['unit'] ?? '');
                $unit = null;
                if ($unitName === '') {
                    $reasons[] = 'Missing unit';
                } else {
                    $unit = Unit::where('name', $unitName)->first();
                    if (!$unit) $reasons[] = "Unit '{$unitName}' does not exist";
                }

                // Buying price
                $buying_price = $data['buying_price'] ?? '';
                if ($buying_price === '' || !is_numeric($buying_price) || intval($buying_price) < 0) {
                    $reasons[] = 'Buying price required, integer, min 0';
                }

                // Selling price
                $selling_price = $data['selling_price'] ?? '';
                if ($selling_price === '' || !is_numeric($selling_price) || intval($selling_price) < 0) {
                    $reasons[] = 'Selling price required, integer, min 0';
                }

                // Tax
                if (isset($data['tax']) && $data['tax'] !== '') {
                    if (!is_numeric($data['tax']) || $data['tax'] < 0 || $data['tax'] > 99999999.99) {
                        $reasons[] = 'Tax must be between 0 and 99999999.99';
                    }
                }

                // Tax type
                if (isset($data['tax_type']) && $data['tax_type'] !== '') {
                    if (mb_strlen($data['tax_type']) > 20) $reasons[] = 'Tax type too long (max 20)';
                }

                // Notes
                if (isset($data['notes']) && !is_null($data['notes']) && !is_string($data['notes'])) {
                    $reasons[] = 'Notes must be a string';
                }

                // Product image (filename length check)
                if (isset($data['product_image']) && mb_strlen($data['product_image']) > 255) {
                    $reasons[] = 'Product image filename too long';
                }

                if (count($reasons) > 0) {
                    $skippedList[] = [
                        'row' => $rowNumber,
                        'name' => $pname ?: null,
                        'code' => $pcode ?: null,
                        'reason' => implode('; ', $reasons)
                    ];
                    continue;
                }

                // Relations (now create category/unit if not exist, as in preview only if valid)
                $data['slug'] = \Str::slug($pname);
                if ($category) {
                    $data['category_id'] = $category->id;
                }
                if ($unit) {
                    $data['unit_id'] = $unit->id;
                }
                if (isset($data['tax_type'])) {
                    if (is_numeric($data['tax_type'])) {
                        $taxType = (int)$data['tax_type'];
                    } else {
                        $taxType = null;
                        foreach (\App\Enums\TaxType::cases() as $case) {
                            if (strcasecmp($case->label(), trim($data['tax_type'])) === 0) {
                                $taxType = $case->value;
                                break;
                            }
                        }
                        if ($taxType === null) {
                            $taxType = \App\Enums\TaxType::EXCLUSIVE->value;
                        }
                    }
                    $data['tax_type'] = $taxType;
                } else {
                    $data['tax_type'] = \App\Enums\TaxType::EXCLUSIVE->value;
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

                // Try to insert
                $product = Product::create($data);
                $successList[] = [
                    'row' => $rowNumber,
                    'name' => $pname,
                    'code' => $pcode,
                ];

                // Log each imported product with product id as loggable_id
                \App\Models\UserActivityLog::create([
                    'user_id' => auth()->id() ?? 1,
                    'action' => 'import',
                    'details' => json_encode([
                        'changes' => "Imported product: {$product->code} ({$product->name})",
                        'product' => [
                            'id' => $product->id,
                            'name' => $product->name,
                            'code' => $product->code,
                        ],
                    ]),
                    'loggable_id' => $product->id,
                    'loggable_type' => \App\Models\Product::class,
                ]);

                $importedProducts[] = [
                    'name' => $product->name,
                    'code' => $product->code,
                    'id' => $product->id,
                ];

            } catch (Exception $e) {
                $errorList[] = [
                    'row' => $rowNumber,
                    'name' => $data['name'] ?? null,
                    'code' => $data['code'] ?? null,
                    'error' => $e->getMessage()
                ];
                \Log::error("Product import error: " . $e->getMessage(), ['row' => $rowNumber, 'data' => $data]);
            }
        }

        return response()->json([
            'message' => "Import complete. Success: " . count($successList) . ", Skipped: " . count($skippedList) . ", Errors: " . count($errorList) . ".",
            'success' => $successList,
            'skipped' => $skippedList,
            'errors' => $errorList,
        ]);
    } catch (Exception $e) {
        \Log::error('Import products failed: ' . $e->getMessage());
        return response()->json([
            'error' => 'Failed to import products: ' . $e->getMessage()
        ], 500);
    }
}
}