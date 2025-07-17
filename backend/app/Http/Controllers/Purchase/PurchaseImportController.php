<?php

namespace App\Http\Controllers\Purchase;

use App\Http\Controllers\Controller;
use App\Models\Purchase;
use App\Models\PurchaseDetail;
use App\Models\Product;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use PhpOffice\PhpSpreadsheet\IOFactory;
use Exception;
use Illuminate\Support\Facades\DB;
use App\Models\UserActivityLog;
class PurchaseImportController extends Controller
{
    /**
     * Preview the purchases to import from the uploaded xls/xlsx file.
     * Returns per-row status: success (can import), skipped (invalid/duplicate/missing), error (parsing error)
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

            // Expected header mapping
            $header = array_map('trim', $rows[0]);
            $header = array_map('strtolower', $header);

            $map = [
                'purchase no'  => 'purchase_no',
                'supplier id'  => 'supplier_id',
                'product code' => 'product_code',
                'quantity'     => 'quantity',
            ];

            $successList = [];
            $skippedList = [];
            $errorList = [];
            $purchasesToInsert = [];

            // To check uniqueness of purchase_no in the import file
            $importedPurchaseNos = [];

            foreach (array_slice($rows, 1) as $rowIndex => $row) {
                $rowNumber = $rowIndex + 2; // Excel-style row number
                if (count(array_filter($row)) === 0) {
                    $skippedList[] = [
                        'row' => $rowNumber,
                        'purchase_no' => null,
                        'product_code' => null,
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
                    $reasons = [];

                    // Purchase-level fields
                    $purchase_no = trim($data['purchase_no'] ?? '');
                    $supplier_id = $data['supplier_id'] ?? null;
                    $product_code = trim($data['product_code'] ?? '');
                    $quantity = $data['quantity'] ?? null;

                    // Validate purchase_no
                    if ($purchase_no === '') {
                        $reasons[] = 'Missing purchase number';
                    } elseif (Purchase::where('purchase_no', $purchase_no)->exists()) {
                        $reasons[] = "Purchase number '{$purchase_no}' already exists";
                    }
                    // Uniqueness in file
                    if ($purchase_no !== '') {
                        if (!isset($importedPurchaseNos[$purchase_no])) {
                            $importedPurchaseNos[$purchase_no] = [];
                        }
                        $importedPurchaseNos[$purchase_no][$rowNumber] = true;
                    }

                    // Validate supplier exists
                    if ($supplier_id === null || !is_numeric($supplier_id)) {
                        $reasons[] = 'Missing or invalid supplier_id';
                    } elseif (!Supplier::where('id', $supplier_id)->exists()) {
                        $reasons[] = "Supplier with id '{$supplier_id}' does not exist";
                    }

                    // Validate product exists
                    if ($product_code === '') {
                        $reasons[] = 'Missing product code';
                    }
                    $product = null;
                    if ($product_code !== '') {
                        $product = Product::where('code', $product_code)->first();
                        if (!$product) {
                            $reasons[] = "Product with code '{$product_code}' does not exist";
                        }
                    }

                    // Validate quantity
                    if ($quantity === null || !is_numeric($quantity) || $quantity < 1) {
                        $reasons[] = 'Missing or invalid quantity';
                    }

                    if (count($reasons) > 0) {
                        $skippedList[] = [
                            'row' => $rowNumber,
                            'purchase_no' => $purchase_no ?: null,
                            'product_code' => $product_code ?: null,
                            'reason' => implode('; ', $reasons)
                        ];
                        continue;
                    }

                    $successList[] = [
                        'row' => $rowNumber,
                        'purchase_no' => $purchase_no,
                        'product_code' => $product_code,
                    ];

                    $purchasesToInsert[] = [
                        'data' => $data,
                        'row' => $rowNumber,
                        'purchase_no' => $purchase_no,
                        'product_code' => $product_code,
                    ];

                } catch (Exception $e) {
                    $errorList[] = [
                        'row' => $rowNumber,
                        'purchase_no' => $data['purchase_no'] ?? null,
                        'product_code' => $data['product_code'] ?? null,
                        'error' => $e->getMessage()
                    ];
                    Log::error("Purchase import row error: " . $e->getMessage(), ['row' => $rowNumber, 'data' => $row]);
                }
            }

            // Check for duplicate purchase_no in the import file itself
            foreach ($importedPurchaseNos as $pno => $rows) {
                if (count($rows) < 2) continue; // ok
            }

            return response()->json([
                'message' => "Preview complete. Success: " . count($successList) . ", Skipped: " . count($skippedList) . ", Errors: " . count($errorList) . ".",
                'success' => $successList,
                'skipped' => $skippedList,
                'errors' => $errorList,
                'to_import' => $purchasesToInsert,
            ]);
        } catch (Exception $e) {
            Log::error('Preview purchases failed: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to preview purchases: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Actually import the purchases.
     * Accepts the file again and repeats the logic, but only imports rows that are valid (as in preview).
     * Groups rows by purchase_no so one purchase can have many products.
     * User only provides purchase no, supplier id, product code, quantity.
     * Date is today, status is 0, unitcost is product.buying_price, total is calculated.
     */
    // public function confirm(Request $request)
    // {
    //     $request->validate([
    //         'file' => 'required|file|mimes:xls,xlsx'
    //     ]);
    //     $file = $request->file('file');

    //     try {
    //         $spreadsheet = IOFactory::load($file->getRealPath());
    //         $sheet = $spreadsheet->getActiveSheet();
    //         $rows = $sheet->toArray();

    //         // Expected header mapping
    //         $header = array_map('trim', $rows[0]);
    //         $header = array_map('strtolower', $header);

    //         $map = [
    //             'purchase no'  => 'purchase_no',
    //             'supplier id'  => 'supplier_id',
    //             'product code' => 'product_code',
    //             'quantity'     => 'quantity',
    //         ];

    //         $successList = [];
    //         $skippedList = [];
    //         $errorList = [];

    //         // Group all rows by purchase_no
    //         $grouped = [];
    //         foreach (array_slice($rows, 1) as $rowIndex => $row) {
    //             $rowNumber = $rowIndex + 2; // Excel-style row number
    //             $data = [];
    //             foreach ($header as $i => $col) {
    //                 if (isset($map[$col]) && isset($row[$i])) {
    //                     $data[$map[$col]] = $row[$i];
    //                 }
    //             }
    //             if (!empty($data['purchase_no'])) {
    //                 $grouped[$data['purchase_no']][] = ['row' => $rowNumber, 'data' => $data];
    //             }
    //         }

    //         DB::beginTransaction();
    //         try {
    //             foreach ($grouped as $purchase_no => $items) {
    //                 $first = $items[0]['data'];

    //                 // Skip if purchase_no exists
    //                 if (Purchase::where('purchase_no', $purchase_no)->exists()) {
    //                     foreach ($items as $item) {
    //                         $skippedList[] = [
    //                             'row' => $item['row'],
    //                             'purchase_no' => $purchase_no,
    //                             'reason' => 'Purchase number already exists'
    //                         ];
    //                     }
    //                     continue;
    //                 }

    //                 // Check supplier exists
    //                 $supplier_id = $first['supplier_id'];
    //                 if (!Supplier::where('id', $supplier_id)->exists()) {
    //                     foreach ($items as $item) {
    //                         $skippedList[] = [
    //                             'row' => $item['row'],
    //                             'purchase_no' => $purchase_no,
    //                             'reason' => "Supplier with id '{$supplier_id}' does not exist"
    //                         ];
    //                     }
    //                     continue;
    //                 }

    //                 // Build product details; if any error, skip the whole purchase
    //                 $productsForDetail = [];
    //                 $total_amount = 0;
    //                 $skipPurchase = false;

    //                 foreach ($items as $item) {
    //                     $data = $item['data'];
    //                     $product = Product::where('code', $data['product_code'])->first();
    //                     if (!$product) {
    //                         $skippedList[] = [
    //                             'row' => $item['row'],
    //                             'purchase_no' => $purchase_no,
    //                             'product_code' => $data['product_code'],
    //                             'reason' => "Product with code '{$data['product_code']}' does not exist"
    //                         ];
    //                         $skipPurchase = true;
    //                         break;
    //                     }
    //                     if (!is_numeric($data['quantity']) || $data['quantity'] < 1) {
    //                         $skippedList[] = [
    //                             'row' => $item['row'],
    //                             'purchase_no' => $purchase_no,
    //                             'product_code' => $data['product_code'],
    //                             'reason' => "Invalid quantity"
    //                         ];
    //                         $skipPurchase = true;
    //                         break;
    //                     }
    //                     $unitcost = $product->buying_price;
    //                     $quantity = (int) $data['quantity'];
    //                     $line_total = $unitcost * $quantity;

    //                     $productsForDetail[] = [
    //                         'product_id' => $product->id,
    //                         'quantity' => $quantity,
    //                         'unitcost' => $unitcost,
    //                         'total' => $line_total,
    //                     ];
    //                     $total_amount += $line_total;
    //                 }

    //                 if ($skipPurchase) {
    //                     continue;
    //                 }

    //                 // Insert purchase
    //                 $purchase = new Purchase();
    //                 $purchase->supplier_id = $supplier_id;
    //                 $purchase->date = date('Y-m-d');
    //                 $purchase->purchase_no = $purchase_no;
    //                 $purchase->status = 0;
    //                 $purchase->total_amount = $total_amount;
    //                 $purchase->created_by = auth()->id() ?? 1;
    //                 $purchase->updated_by = null;
    //                 $purchase->save();

    //                 foreach ($productsForDetail as $detailData) {
    //                     $detail = new PurchaseDetail();
    //                     $detail->purchase_id = $purchase->id;
    //                     $detail->product_id = $detailData['product_id'];
    //                     $detail->quantity = $detailData['quantity'];
    //                     $detail->unitcost = $detailData['unitcost'];
    //                     $detail->total = $detailData['total'];
    //                     $detail->save();
    //                 }

    //                 foreach ($items as $item) {
    //                     $successList[] = [
    //                         'row' => $item['row'],
    //                         'purchase_no' => $purchase_no,
    //                         'product_code' => $item['data']['product_code'] ?? null,
    //                     ];
    //                 }
    //             }
    //             DB::commit();
    //         } catch (Exception $e) {
    //             DB::rollBack();
    //             throw $e;
    //         }

    //         return response()->json([
    //             'message' => "Import complete. Success: " . count($successList) . ", Skipped: " . count($skippedList) . ", Errors: " . count($errorList) . ".",
    //             'success' => $successList,
    //             'skipped' => $skippedList,
    //             'errors' => $errorList,
    //         ]);
    //     } catch (Exception $e) {
    //         Log::error('Import purchases failed: ' . $e->getMessage());
    //         return response()->json([
    //             'error' => 'Failed to import purchases: ' . $e->getMessage()
    //         ], 500);
    //     }
    // }

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

        // Expected header mapping
        $header = array_map('trim', $rows[0]);
        $header = array_map('strtolower', $header);

        $map = [
            'purchase no'  => 'purchase_no',
            'supplier id'  => 'supplier_id',
            'product code' => 'product_code',
            'quantity'     => 'quantity',
        ];

        $successList = [];
        $skippedList = [];
        $errorList = [];

        // Group all rows by purchase_no
        $grouped = [];
        foreach (array_slice($rows, 1) as $rowIndex => $row) {
            $rowNumber = $rowIndex + 2; // Excel-style row number
            $data = [];
            foreach ($header as $i => $col) {
                if (isset($map[$col]) && isset($row[$i])) {
                    $data[$map[$col]] = $row[$i];
                }
            }
            if (!empty($data['purchase_no'])) {
                $grouped[$data['purchase_no']][] = ['row' => $rowNumber, 'data' => $data];
            }
        }

        DB::beginTransaction();
        try {
            foreach ($grouped as $purchase_no => $items) {
                $first = $items[0]['data'];

                // Skip if purchase_no exists
                if (Purchase::where('purchase_no', $purchase_no)->exists()) {
                    foreach ($items as $item) {
                        $skippedList[] = [
                            'row' => $item['row'],
                            'purchase_no' => $purchase_no,
                            'reason' => 'Purchase number already exists'
                        ];
                    }
                    continue;
                }

                // Check supplier exists
                $supplier_id = $first['supplier_id'];
                if (!Supplier::where('id', $supplier_id)->exists()) {
                    foreach ($items as $item) {
                        $skippedList[] = [
                            'row' => $item['row'],
                            'purchase_no' => $purchase_no,
                            'reason' => "Supplier with id '{$supplier_id}' does not exist"
                        ];
                    }
                    continue;
                }

                // Build product details; if any error, skip the whole purchase
                $productsForDetail = [];
                $total_amount = 0;
                $skipPurchase = false;

                foreach ($items as $item) {
                    $data = $item['data'];
                    $product = Product::where('code', $data['product_code'])->first();
                    if (!$product) {
                        $skippedList[] = [
                            'row' => $item['row'],
                            'purchase_no' => $purchase_no,
                            'product_code' => $data['product_code'],
                            'reason' => "Product with code '{$data['product_code']}' does not exist"
                        ];
                        $skipPurchase = true;
                        break;
                    }
                    if (!is_numeric($data['quantity']) || $data['quantity'] < 1) {
                        $skippedList[] = [
                            'row' => $item['row'],
                            'purchase_no' => $purchase_no,
                            'product_code' => $data['product_code'],
                            'reason' => "Invalid quantity"
                        ];
                        $skipPurchase = true;
                        break;
                    }
                    $unitcost = $product->buying_price;
                    $quantity = (int) $data['quantity'];
                    $line_total = $unitcost * $quantity;

                    $productsForDetail[] = [
                        'product_id' => $product->id,
                        'quantity' => $quantity,
                        'unitcost' => $unitcost,
                        'total' => $line_total,
                    ];
                    $total_amount += $line_total;
                }

                if ($skipPurchase) {
                    continue;
                }

                // Insert purchase
                $purchase = new Purchase();
                $purchase->supplier_id = $supplier_id;
                $purchase->date = date('Y-m-d');
                $purchase->purchase_no = $purchase_no;
                $purchase->status = 0;
                $purchase->total_amount = $total_amount;
                $purchase->created_by = auth()->id() ?? 1;
                $purchase->updated_by = null;
                $purchase->save();

                foreach ($productsForDetail as $detailData) {
                    $detail = new PurchaseDetail();
                    $detail->purchase_id = $purchase->id;
                    $detail->product_id = $detailData['product_id'];
                    $detail->quantity = $detailData['quantity'];
                    $detail->unitcost = $detailData['unitcost'];
                    $detail->total = $detailData['total'];
                    $detail->save();
                }

                // Log activity: just "Created a new purchase: ..."
                UserActivityLog::create([
                    'user_id' => auth()->id() ?? 1,
                    'action' => 'import',
                    'details' => json_encode([
                        'purchase' => $purchase->purchase_no,
                        'changes' => "Created a new purchase: " . $purchase->purchase_no,
                    ]),
                    'loggable_id' => $purchase->id,
                    'loggable_type' => Purchase::class,
                ]);

                foreach ($items as $item) {
                    $successList[] = [
                        'row' => $item['row'],
                        'purchase_no' => $purchase_no,
                        'product_code' => $item['data']['product_code'] ?? null,
                    ];
                }
            }
            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }

        return response()->json([
            'message' => "Import complete. Success: " . count($successList) . ", Skipped: " . count($skippedList) . ", Errors: " . count($errorList) . ".",
            'success' => $successList,
            'skipped' => $skippedList,
            'errors' => $errorList,
        ]);
    } catch (Exception $e) {
        Log::error('Import purchases failed: ' . $e->getMessage());
        return response()->json([
            'error' => 'Failed to import purchases: ' . $e->getMessage()
        ], 500);
    }
}
}