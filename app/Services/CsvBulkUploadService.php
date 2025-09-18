<?php

namespace App\Services;

use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use League\Csv\Reader;

class CsvBulkUploadService
{
    /**
     * Process a CSV file and execute a callback for each row
     *
     * @param UploadedFile $file The uploaded CSV file
     * @param callable $rowProcessor Callback that processes each row: function(array $record, int $rowNumber, array $context): array
     *                               Should return ['success' => bool, 'data' => mixed, 'errors' => array]
     * @param array $context Additional context to pass to the row processor
     * @param array $requiredColumns Array of required column names
     * @return array Results with total_rows, successful, errors
     * @throws \Exception
     */
    public function processFile(
        UploadedFile $file,
        callable $rowProcessor,
        array $context = [],
        array $requiredColumns = []
    ): array {
        $csv = Reader::createFromPath($file->getRealPath(), 'r');
        $csv->setHeaderOffset(0);

        $records = $csv->getRecords();
        $header = $csv->getHeader();

        // Validate required columns
        if (!empty($requiredColumns)) {
            $missingColumns = array_diff($requiredColumns, $header);
            if (!empty($missingColumns)) {
                throw new \Exception('Missing required columns: ' . implode(', ', $missingColumns));
            }
        }

        $results = [
            'total_rows' => 0,
            'successful' => 0,
            'errors' => [],
            'data' => []
        ];

        foreach ($records as $lineNumber => $record) {
            $results['total_rows']++;
            $rowNumber = $lineNumber + 1; // Account for header

            try {
                $processingResult = $rowProcessor($record, $rowNumber, $context);

                if ($processingResult['success']) {
                    $results['successful']++;
                    if (isset($processingResult['data'])) {
                        $results['data'][] = $processingResult['data'];
                    }
                } else {
                    if (isset($processingResult['errors'])) {
                        $results['errors'] = array_merge($results['errors'], $processingResult['errors']);
                    }
                }
            } catch (\Exception $e) {
                $results['errors'][] = [
                    'row' => $rowNumber,
                    'message' => "Processing error: {$e->getMessage()}"
                ];
            }
        }

        return $results;
    }

    /**
     * Validate that required fields are present and not empty
     */
    public function validateRequiredFields(array $record, array $requiredFields, int $rowNumber): array
    {
        $errors = [];

        foreach ($requiredFields as $field) {
            if (empty($record[$field])) {
                $errors[] = [
                    'row' => $rowNumber,
                    'message' => "Missing required field: {$field}"
                ];
            }
        }

        return $errors;
    }
}
