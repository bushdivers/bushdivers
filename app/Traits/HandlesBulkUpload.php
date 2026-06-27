<?php

namespace App\Traits;

use App\Services\CsvBulkUploadService;
use CsvResult;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use UploadRowProcessor;

/**
 * @phpstan-import-type CsvRecord from CsvBulkUploadService
 * @phpstan-import-type CsvError from CsvBulkUploadService
 * @phpstan-import-type CsvProcessingResult from CsvBulkUploadService
 * @phpstan-import-type CsvResult from CsvBulkUploadService
 * @phpstan-import-type CallbackContext from CsvBulkUploadService
 * @phpstan-import-type CsvRowProcessor from CsvBulkUploadService
 *
 * @phpstan-type UploadProcessor callable(\Illuminate\Http\UploadedFile $file, Request $request): CsvResult
 * @phpstan-type UploadRowProcessor callable(CsvRecord $record): void
 */
trait HandlesBulkUpload
{
    /**
     * Handle a bulk upload request with a custom processor
     *
     * @param Request $request
     * @param UploadProcessor $processor Callback to process the uploaded file
     * @param string $redirectUrl URL to redirect to after processing
     * @param array<string, mixed> $validationRules Additional validation rules
     * @return \Illuminate\Http\RedirectResponse
     */
    protected function handleBulkUpload(
        Request $request,
        callable $processor,
        string $redirectUrl,
        array $validationRules = []
    ): RedirectResponse {
        $defaultRules = [
            'file' => 'required|file|mimes:csv,txt|max:2048',
        ];

        $request->validate(array_merge($defaultRules, $validationRules));

        try {
            $results = $processor($request->file('file'), $request);

            return back()->with('bulkUploadResults', $results);
        } catch (\Exception $e) {
            return back()->withErrors(['file' => 'Error processing file: ' . $e->getMessage()]);
        }
    }

    /**
      * Process a CSV file with Laravel validation rules for each row
      *
      * @param \Illuminate\Http\UploadedFile $file
      * @param array<string, mixed> $validationRules Laravel validation rules for each row
      * @param array<string> $requiredColumns Required column names
      * @param UploadRowProcessor $rowProcessor Callback to process valid rows
      * @param array<string, string> $customMessages Custom validation messages
      * @return CsvResult Results with created/failed counts and errors
      */
    protected function processCsvUpload(
        \Illuminate\Http\UploadedFile $file,
        array $requiredColumns,
        array $validationRules,
        callable $rowProcessor,
        array $customMessages = []
    ): array {
        return $this->getCsvService()->processFile(
            $file,
            function ($record, $rowNumber, $context) use ($validationRules, $rowProcessor, $customMessages) {
                $validator = Validator::make($record, $validationRules, $customMessages);

                if ($validator->fails()) {
                    return [
                        'success' => false,
                        'errors' => [[
                            'row' => $rowNumber,
                            'message' => implode(', ', $validator->errors()->all())
                        ]]
                    ];
                }

                try {
                    // Process the validated data
                    $rowProcessor($validator->validated());
                    return ['success' => true];
                } catch (\Exception $e) {
                    return [
                        'success' => false,
                        'errors' => [[
                            'row' => $rowNumber,
                            'message' => $e->getMessage()
                        ]]
                    ];
                }
            },
            [],
            $requiredColumns
        );
    }

    /**
     * Get the CSV bulk upload service
     */
    protected function getCsvService(): CsvBulkUploadService
    {
        return app(CsvBulkUploadService::class);
    }
}
