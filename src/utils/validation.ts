const emergencyNumbers = [
  '+1911', // US
  '+112', // Europe (common)
  '+999', // UK
  '+86110', // China
  '+61000', // Australia
  '+64111', // New Zealand
  '+81119', // Japan
  '+82119', // South Korea
  '+911', // India
  '+78112', // Russia
  '+972100', // Israel
  '+55192', // Brazil
  '+1204', // Canada
  '+20122', // Egypt
  '+27111', // South Africa
  '+971999', // UAE
  '+52115', // Mexico
  '+65104', // Singapore
  '+54155', // Argentina
  '+90255', // Turkey
  '+254999', // Kenya
  '+33112', // France
  '+49112', // Germany
  '+39112', // Italy
  '+34112', // Spain
  '+46112', // Sweden
  '+31112', // Netherlands
  '+9215', // Pakistan
  '+30112', // Greece
  '+234112', // Nigeria
  '+60112', // Malaysia
  '+621112', // Indonesia
  '+852112', // Hong Kong
  '+351112', // Portugal
  '+358112', // Finland
  '+414412', // Switzerland
  '+353112', // Ireland
  '+352112', // Luxembourg
  '+371112', // Latvia
  '+372112', // Estonia
  '+375112', // Belarus
  '+48112', // Poland
  '+389112', // North Macedonia
  '+386112', // Slovenia
  '+387112', // Bosnia and Herzegovina
  '+371112', // Lithuania
  '+380112', // Ukraine
  '+374112', // Armenia
  '+995112', // Georgia
  '+994112', // Azerbaijan
  '+231911', // Liberia
  '+251911', // Ethiopia
  '+216197', // Tunisia
  '+21314', // Algeria
  '+22017', // Gambia
  '+263999', // Zimbabwe
  '+260991', // Zambia
];

export const isEmergencyNumber = (value: string) => emergencyNumbers.includes(value);
