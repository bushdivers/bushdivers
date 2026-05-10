<?php

namespace App\Services\Aircraft;

use App\Models\Aircraft;
use Log;

class FindAvailableRegistration
{
    public function execute(?string $country): string
    {
        $reg = '';

        if (!$country) {
            Log::info("No country code provided for registration generation, defaulting to 'N-####'");
            $template = 'N-####';
        } else {
            $template = self::REGO_MAP[$country] ?? null;
            if (!$template) {
                Log::info("No registration template for country code $country, defaulting to 'N-####'");
                $template = 'N-####';
            }
        }

        $maxAttempts = 500; // _something_ to break deadlock

        for ($i = 0; $i < $maxAttempts; $i++) {
            $reg = $this->generateRegistration($template);
            $exists = Aircraft::where('registration', $reg)->exists();
            if (!$exists) {
                return $reg;
            }
        }

        Log::error("Unable to generate unique registration for region $country.");
        throw new \Exception('Unable to generate unique registration.');
    }

    // Apologies to any country I miscategorised or grouped inappropriately
    // Comments are generated based on data from old MSFS airport database
    // Don't @me but feel free to open PR (with wikipedia link for justification)
    private const REGO_MAP = [
        'AU' => 'VH-@@@', // Australia - East Asia & Pacific
        'CX' => 'VH-@@@', // Australian Indian Ocean Territories - East Asia & Pacific
        'NF' => 'VH-@@@', // Norfolk Island - East Asia & Pacific

        'BN' => 'V8-@@@', // Brunei - East Asia & Pacific
        'CK' => 'E5-@@@', // Cook Islands (NZ derivative) - East Asia & Pacific
        'CN' => ['B-####', 'B-###@', 'B-##@@'], // People's Republic of China - East Asia & Pacific.
        'FJ' => 'DQ-@@@', // Fiji - East Asia & Pacific
        'HK' => ['B-H@@', 'B-K@@', 'B-L@@'], // Hong Kong - East Asia & Pacific
        'ID' => 'PK-@@@', // Indonesia - East Asia & Pacific
        'JP' => ['JA####', 'JA###@', 'JA##@@'], // Japan - East Asia & Pacific. Wiki has more options, only partial
        'KH' => 'XU-@@@', // Cambodia - East Asia & Pacific
        'KI' => 'T3-@@@', // Kiribati - East Asia & Pacific
        'KP' => 'P-###', // North Korea - East Asia & Pacific. Wiki says 500-999 but I don't want to limit more than I have to
        'KR' => 'HL-####', // South Korea - East Asia & Pacific. Wiki has complex rules on types, but we can't type-restrict
        'LA' => 'RDPL-#####', // Laos - East Asia & Pacific. Hope this doesn't break UI with the length
        'MH' => 'V7-####', // Marshall Islands - East Asia & Pacific
        'MM' => 'XY-@@@', // Myanmar - East Asia & Pacific
        'MN' => 'JU-^###', // Mongolia - East Asia & Pacific
        'MY' => '9M-@@@', // Malaysia - East Asia & Pacific
        'NR' => 'C2-@@@', // Nauru - East Asia & Pacific

        'NU' => 'ZK-@@@', // Niue - East Asia & Pacific
        'NZ' => 'ZK-@@@', // New Zealand - East Asia & Pacific
        'PW' => 'T8A-###', // Palau - East Asia & Pacific. Formerly NZ?

        'NC' => 'F-O@@@', // New Caledonia - East Asia & Pacific
        'PF' => 'F-O@@@', // French Polynesia - East Asia & Pacific
        'WF' => 'F-O@@@', // Wallis and Futuna - East Asia & Pacific. I think?
        'PM' => 'F-O@@@', // Saint Pierre and Miquelon - North America. I think?
        'BL' => 'F-O@@@', // Saint-Barthélemy - Latin America & Caribbean. Probably.

        'PG' => 'P2-@@@', // Papua New Guinea - East Asia & Pacific
        'PH' => 'RP-C####', // Philippines - East Asia & Pacific. Wiki says RP-#### for govt,

        'SB' => 'H4-@@@', // Solomon - East Asia & Pacific
        'SG' => '9V-@@@', // Singapore - East Asia & Pacific
        'TH' => 'HS-@@@', // Thailand - East Asia & Pacific
        'TL' => '4W-@@@', // East Timor - East Asia & Pacific
        'TO' => 'A3-###', // Tonga - East Asia & Pacific
        'TW' => 'B-#####', // Taiwan - East Asia & Pacific
        'VN' => ['VN-^###', 'VN-A###', 'VN-B###', 'VN-C###'], // Vietnam - East Asia & Pacific. Wiki says this is generally heli, jet, turboprop, ICE respectively
        'VU' => ['YJ-@@^', 'YJ-@@##'], // Vanuatu - East Asia & Pacific. Ish.
        'WS' => '5W-@@@', // Samoa - East Asia & Pacific

        'AF' => 'YA-@@@', // Afghanistan - South Asia
        'BD' => 'S2-@@@', // Bangladesh - South Asia
        'BT' => 'A5-@@@', // Bhutan - South Asia
        'IN' => 'VT-@@@', // India - South Asia
        'LK' => '4R-@@@', // Sri Lanka - South Asia
        'MV' => '8Q-@@@', // Maldives - South Asia
        'NP' => '9N-@@@', // Nepal - South Asia. R@@ specifically for govt
        'PK' => 'AP-@@@', // Pakistan - South Asia

        'AL' => 'ZA-@@@', // Albania - Europe & Central Asia
        'AM' => ['EK-###', 'EK-#####'], // Armenia - Europe & Central Asia
        'AT' => ['OE-@@@', 'OE-####'], // Austria - Europe & Central Asia
        'AZ' => ['4K-AZ^##', '4K-#####'], // Azerbaijan - Europe & Central Asia
        'BA' => 'E7-@@@', // Bosnia and Herzegovina - Europe & Central Asia
        'BE' => 'OO-@@@', // Belgium - Europe & Central Asia
        'BG' => 'LZ-@@@', // Bulgaria - Europe & Central Asia
        'BY' => ['EW-^####', 'EW-^##@@'], // Belarus - Europe & Central Asia
        'CH' => 'HB-@@@', // Switzerland - Europe & Central Asia. Simplified to ignore types
        'CY' => '5B-@@@', // Cyprus - Europe & Central Asia
        'CZ' => 'OK-@@@', // Czech Republic - Europe & Central Asia
        'DE' => ['D-C@@@', 'D-E@@@', 'D-I@@@'], // Germany - Europe & Central Asia (5-14T MTOW, single engine to 2T, and multi 2-5.7T respectively)

        'DK' => 'OY-@@@', // Denmark - Europe & Central Asia
        'FO' => 'OY-@@@', // Faroe Islands - Europe & Central Asia
        'GL' => 'OY-@@@', // Greenland - Europe & Central Asia

        'EE' => 'ES-@@@', // Estonia - Europe & Central Asia
        'ES' => 'EC-@@@', // Spain - Europe & Central Asia. technically only to EC-WZZ
        'FI' => 'OH-@@@', // Finland - Europe & Central Asia
        'FR' => 'F-@@@@', // France - Europe & Central Asia

        'GB' => 'G-@@@@', // United Kingdom - Europe & Central Asia
        'IO' => 'G-@@@@', // British Indian Ocean Territory - Sub-Saharan Africa.  Diego Garcia Navy. UK base shared to US

        'GG' => '2-@@@@', // Guernsey - Europe & Central Asia
        'JE' => '2-@@@@', // Jersey - Europe & Central Asia. Jersey registry defunct 2022. Was ZJ-. Absorbed into Channel Islands?

        'GE' => '4L-@@@', // Georgia - Europe & Central Asia
        'GR' => 'SX-@@@', // Greece - Europe & Central Asia
        'HR' => '9A-@@@', // Croatia - Europe & Central Asia
        'HU' => 'HA-@@@', // Hungary - Europe & Central Asia
        'IE' => 'EI-@@@', // Ireland - Europe & Central Asia
        'IM' => 'M-@@@@', // Isle of Man - Europe & Central Asia
        'IS' => 'TF-@@@', // Iceland - Europe & Central Asia
        'IT' => 'I-@@@@', // Italy - Europe & Central Asia
        'KG' => ['EX-###', 'EX-#####'], // Kyrgyzstan - Europe & Central Asia
        'KZ' => 'UP-@@@##', // Kazakhstan - Europe & Central Asia
        'LT' => 'LY-@@@', // Lithuania - Europe & Central Asia
        'LU' => 'LX-@@@', // Luxembourg - Europe & Central Asia
        'LV' => 'YL-@@@', // Latvia - Europe & Central Asia
        'MD' => 'ER-@@@', // Moldova - Europe & Central Asia
        'ME' => '4O-@@@', // Montenegro - Europe & Central Asia
        'MK' => 'Z3-@@@', // Republic of Macedonia - Europe & Central Asia

        'NL' => 'PH-@@@', // Netherlands - Europe & Central Asia

        'NO' => 'LN-@@@', // Norway - Europe & Central Asia
        'PL' => 'SP-@@@', // Poland - Europe & Central Asia
        'PT' => 'CS-@@@', // Portugal - Europe & Central Asia
        'RO' => 'YR-@@@', // Romania - Europe & Central Asia
        'RS' => 'YU-@@@', // Serbia - Europe & Central Asia
        'RU' => 'RA-#####', // Russia - Europe & Central Asia
        'SE' => 'SE-@@@', // Sweden - Europe & Central Asia
        'SI' => 'S5-@@@', // Slovenia - Europe & Central Asia
        'SK' => 'OM-@@@', // Slovakia - Europe & Central Asia
        'TJ' => 'EY-^####', // Tajikistan - Europe & Central Asia
        'TM' => 'EZ-@^##', // Turkmenistan - Europe & Central Asia
        'TR' => 'TC-@@@', // Turkey - Europe & Central Asia
        'UA' => ['UR-@@@', 'UR-@@@@', 'UR^####'], // Ukraine - Europe & Central Asia
        'UZ' => 'UK^####', // Uzbekistan - Europe & Central Asia
        'XK' => 'Z6-@@@', // Kosovo - Europe & Central Asia

        'AE' => 'A6-@@@', // United Arab Emirates - Middle East & North Africa
        'BH' => ['A9C-@@', 'A9C-@@@', 'A9C-@@@@'], // Bahrain - Middle East & North Africa
        'DJ' => 'J2-@@@', // Djibouti - Middle East & North Africa
        'DZ' => '7T-V@@', // Algeria - Middle East & North Africa. Wiki says 7T-V@@ for civil, but that's only 26*26 options
        'EG' => 'SU-@@@', // Egypt - Middle East & North Africa. AAA-XXZ, ZAA-ZZZ
        'IL' => '4X-@@@', // Israel - Middle East & North Africa
        'IQ' => 'YI-@@@', // Iraq - Middle East & North Africa
        'IR' => 'EP-@@@', // Iran - Middle East & North Africa
        'JO' => 'JY-@@@', // Jordan - Middle East & North Africa
        'KW' => '9K-@@@', // Kuwait - Middle East & North Africa
        'LB' => 'OD-@@@', // Lebanon - Middle East & North Africa
        'LY' => '5A-@@@', // Libya - Middle East & North Africa
        'MA' => 'CN-@@@', // Morocco - Middle East & North Africa
        'MT' => ['9H-@@@', '9H-@@@@', '9H-@@@@@'], // Malta - Middle East & North Africa
        'OM' => ['A4O-@@@', 'A4O-@@'], // Oman - Middle East & North Africa
        'PS' => null, // Palestine - Middle East & North Africa. Uhh... all three airports are 'closed' anyway
        'QA' => 'A7-@@@', // Qatar - Middle East & North Africa
        'SA' => ['HZ-@@@', 'HZ-@@^', 'HZ-@@^#'], // Saudi Arabia - Middle East & North Africa. This isn't all options
        'SY' => 'YK-@@@', // Syria - Middle East & North Africa
        'TN' => 'TS-@@@', // Tunisia - Middle East & North Africa
        'YE' => '7O-@@@', // Yemen - Middle East & North Africa

        'AO' => 'D2-@@@', // Angola - Sub-Saharan Africa
        'BF' => 'XT-@@@', // Burkina Faso - Sub-Saharan Africa
        'BI' => '9U-@@@', // Burundi - Sub-Saharan Africa
        'BJ' => 'TY-@@@', // Benin - Sub-Saharan Africa
        'BW' => 'A2-@@@', // Botswana - Sub-Saharan Africa
        'CD' => '9S-@@@', // Democratic Republic of the Congo - Sub-Saharan Africa. 9T- for military
        'CF' => 'TL-@@@', // Central African Republic - Sub-Saharan Africa
        'CG' => 'TN-@@@', // Republic of the Congo - Sub-Saharan Africa
        'CI' => 'TU-@@@', // Ivory Coast - Sub-Saharan Africa
        'CM' => 'TJ-@@@', // Cameroon - Sub-Saharan Africa
        'CV' => 'D4-@@@', // Cape Verde - Sub-Saharan Africa
        'ER' => 'E3-@@@@', // Eritrea - Sub-Saharan Africa
        'ET' => 'ET-@@@', // Ethiopia - Sub-Saharan Africa
        'GA' => 'TR-@@@', // Gabon - Sub-Saharan Africa
        'GH' => '9G-@@@', // Ghana - Sub-Saharan Africa
        'GM' => 'C5-@@@', // The Gambia - Sub-Saharan Africa
        'GN' => '3X-@@@', // Guinea - Sub-Saharan Africa
        'GQ' => '3C-@@@', // Equatorial Guinea - Sub-Saharan Africa
        'GW' => 'J5-@@@', // Guinea-Bissau - Sub-Saharan Africa
        'KE' => '5Y-@@@', // Kenya - Sub-Saharan Africa
        'KM' => 'D6-@@@', // Comoros - Sub-Saharan Africa
        'LR' => 'A8-@@@', // Liberia - Sub-Saharan Africa
        'LS' => '7P-@@@', // Lesotho - Sub-Saharan Africa
        'MG' => '5R-@@@', // Madagascar - Sub-Saharan Africa
        'ML' => 'TZ-@@@', // Mali - Sub-Saharan Africa
        'MR' => '5T-@@@', // Mauritania - Sub-Saharan Africa
        'MU' => '3B-@@@', // Mauritius - Sub-Saharan Africa
        'MW' => '7Q-@@@', // Malawi - Sub-Saharan Africa
        'MZ' => 'C9-@@@', // Mozambique - Sub-Saharan Africa
        'NA' => 'V5-@@@', // Namibia - Sub-Saharan Africa
        'NE' => '5U-@@@', // Niger - Sub-Saharan Africa
        'NG' => '5N-@@@', // Nigeria - Sub-Saharan Africa
        'RW' => '9XR-@@', // Rwanda - Sub-Saharan Africa. Wiki says 9XR-@@ but that's getting small
        'SC' => 'S7-@@@', // Seychelles - Sub-Saharan Africa
        'SD' => 'ST-@@@', // Sudan - Sub-Saharan Africa
        'SH' => 'VQ-H@@', // Saint Helena - Sub-Saharan Africa. Only 26*26 options.
        'SL' => '9L-@@@', // Sierra Leone - Sub-Saharan Africa
        'SN' => '6V-@@@', // Senegal - Sub-Saharan Africa
        'SO' => '6O-@@@', // Somalia - Sub-Saharan Africa
        'SS' => 'Z8-@@@', // South Sudan - Sub-Saharan Africa
        'ST' => 'S9-@@@', // São Tomé and Príncipe - Sub-Saharan Africa
        'SZ' => '3DC-@@@', // eSwatini - Sub-Saharan Africa
        'TD' => 'TT-@@@', // Chad - Sub-Saharan Africa
        'TG' => '5V-@@@', // Togo - Sub-Saharan Africa
        'TZ' => '5H-@@@', // Tanzania - Sub-Saharan Africa
        'UG' => '5X-@@@', // Uganda - Sub-Saharan Africa
        'ZA' => 'ZS-@@@', // South Africa - Sub-Saharan Africa
        'ZM' => '9J-@@@', // Zambia - Sub-Saharan Africa
        'ZW' => 'Z-@@@', // Zimbabwe - Sub-Saharan Africa

        'BM' => ['VP-B@@', 'VQ-B@@'], // Bermuda - North America
        'CA' => ['C-F@@@', 'C-G@@@'], // Canada - North America

        // This isn't all the possible options, but decent assortment
        // No idea if these external territories map or not
        'US' => ['N^###', 'N^####', 'N^###@', 'N^##@@'], // United States of America - North America
        'UM' => ['N^###', 'N^####', 'N^###@', 'N^##@@'], // United States Minor Outlying Islands - East Asia & Pacific
        'AS' => ['N^###', 'N^####', 'N^###@', 'N^##@@'], // American Samoa - East Asia & Pacific
        'GU' => ['N^###', 'N^####', 'N^###@', 'N^##@@'], // Guam - East Asia & Pacific
        'MP' => ['N^###', 'N^####', 'N^###@', 'N^##@@'], // Northern Mariana Islands - East Asia & Pacific
        'PR' => ['N^###', 'N^####', 'N^###@', 'N^##@@'], // Puerto Rico - Latin America & Caribbean
        'VI' => ['N^###', 'N^####', 'N^###@', 'N^##@@'], // United States Virgin Islands - Latin America & Caribbean

        // Netherlands Antilles
        'CW' => 'PJ-@@@', // Curaçao - Latin America & Caribbean
        'MF' => 'PJ-@@@', // Saint Martin - Latin America & Caribbean

        'AG' => 'V2-@@@', // Antigua and Barbuda - Latin America & Caribbean
        'AI' => 'VP-A@@', // Anguilla - Latin America & Caribbean. Only 26*26 options
        'AR' => 'LV-@@@', // Argentina - Latin America & Caribbean
        'BB' => '8P-@@@', // Barbados - Latin America & Caribbean
        'BO' => 'CP-^###', // Bolivia - Latin America & Caribbean
        'BR' => ['PT-@@@', 'PR-@@@', 'PS-@@@'], // Brazil - Latin America & Caribbean
        'BS' => 'C6-@@@', // The Bahamas - Latin America & Caribbean
        'BZ' => 'V3-@@@', // Belize - Latin America & Caribbean
        'CL' => 'CC-@@@', // Chile - Latin America & Caribbean
        'CO' => 'HK-^###@', // Colombia - Latin America & Caribbean
        'CR' => 'TI-@@@', // Costa Rica - Latin America & Caribbean
        'CU' => ['CU-C1###', 'CU-N1###', 'CU-T1###'], // Cuba - Latin America & Caribbean (airline cargo, private, airline pax respectively)
        'DM' => 'J7-@@@', // Dominica - Latin America & Caribbean
        'DO' => 'HI^##@@', // Dominican Republic - Latin America & Caribbean
        'EC' => 'HC-@@@', // Ecuador - Latin America & Caribbean
        'FK' => 'VP-F@@', // Falkland Islands - Latin America & Caribbean. Only 26*26 options :(
        'GD' => 'J3-@@@', // Grenada - Latin America & Caribbean
        'GT' => 'TG-@@@', // Guatemala - Latin America & Caribbean
        'GY' => '8R-@@@', // Guyana - Latin America & Caribbean
        'HN' => 'HR-@@@', // Honduras - Latin America & Caribbean
        'HT' => 'HH-@@@', // Haiti - Latin America & Caribbean
        'JM' => '6Y-@@@', // Jamaica - Latin America & Caribbean
        'KN' => 'V4-@@@', // Saint Kitts and Nevis - Latin America & Caribbean
        'KY' => ['VP-C@@', 'VQ-C@@'], // Cayman Islands - Latin America & Caribbean
        'LC' => 'J6-@@@', // Saint Lucia - Latin America & Caribbean
        'MS' => 'VP-M@@', // Montserrat - Latin America & Caribbean
        'MX' => 'XA-@@@', // Mexico - Latin America & Caribbean
        'NI' => 'YN-@@@', // Nicaragua - Latin America & Caribbean
        'PA' => 'HP-^###AP', // Panama - Latin America & Caribbean. Suffix usually airline ICAO (eg, CMP or PST). FR24 suggests AP is for GA?
        'PE' => 'OB-^###', // Peru - Latin America & Caribbean
        'PY' => 'ZP-@@@', // Paraguay - Latin America & Caribbean
        'SR' => 'PZ-@@@', // Suriname - Latin America & Caribbean
        'SV' => 'YS-@@@', // El Salvador - Latin America & Caribbean
        'TC' => 'VQ-T@@', // Turks and Caicos Islands - Latin America & Caribbean
        'TT' => '9Y-@@@', // Trinidad and Tobago - Latin America & Caribbean
        'UY' => 'CX-@@@', // Uruguay - Latin America & Caribbean
        'VC' => 'J8-@@@', // Saint Vincent and the Grenadines - Latin America & Caribbean
        'VE' => ['YV^###', 'YV^##T'], // Venezuela - Latin America & Caribbean
        'VG' => 'VP-L@@', // British Virgin Islands - Latin America & Caribbean

    ];

    private function generateRegistration(string|array $template): string
    {
        if (\is_array($template)) {
            $template = $template[array_rand($template)];
        }

        $reg = '';
        $len = \strlen($template);
        for ($i = 0; $i < $len; $i++) {
            $reg .= match ($template[$i]) {
                '#' => mt_rand(0, 9),
                '^' => mt_rand(1, 9), // 1-9
                '@' => \chr(mt_rand(65, 90)), // A-Z
                default => $template[$i],
            };
        }

        return $reg;
    }


}
