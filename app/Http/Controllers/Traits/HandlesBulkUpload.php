<?php

namespace App\Http\Controllers\Traits;

use App\Services\CsvBulkUploadService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

trait HandlesBulkUpload
{
    /**
     * Handle a bulk upload request with a custom processor
     *
     * @param Request $request
     * @param callable $processor Callback to process the uploaded file
     * @param string $redirectUrl URL to redirect to after processing
     * @param array $validationRules Additional validation rules
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
     * @param array $validationRules Laravel validation rules for each row
     * @param callable $rowProcessor Callback to process valid rows
     * @param array $requiredColumns Required column names
     * @param array $customMessages Custom validation messages
     * @return array Results with created/failed counts and errors
     */
    protected function processCsvUpload(
        $file,
        array $requiredColumns,
        array $validationRules,
        callable $rowProcessor,
        array $customMessages = []
    ): array {
        return $this->getCsvService()->processFile(
            $file,
            function($record, $rowNumber, $context) use ($validationRules, $rowProcessor, $customMessages) {
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
