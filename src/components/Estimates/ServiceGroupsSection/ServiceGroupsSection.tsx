import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form-mui';

import { Shop } from 'src/models';

// import CannedJobsSelector from './CannedJobsSelector';
import { ServiceGroup } from '../ServiceGroup';

interface ServiceGroupsSectionProps {
  shop: Shop;
}

export const ServiceGroupsSection = ({ shop }: ServiceGroupsSectionProps) => {
  const t = useTranslations();
  const { control, watch, setError } = useFormContext();
  const [hideDescriptions, setHideDescriptions] = useState<number[]>([]);

  const {
    fields,
    append: appendField,
    remove: removeField,
  } = useFieldArray({
    control,
    name: 'serviceGroups',
  });

  return (
    <>
      {/*<Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>*/}
      {/*  <CannedJobsSelector />*/}
      {/*</Box>*/}

      {fields.map((field, index) => (
        <ServiceGroup
          key={field.id}
          index={index}
          isLast={index === fields.length - 1}
          hideDescription={hideDescriptions.includes(index)}
          onAddNewGroup={() => {
            appendField({
              description: '',
              category: '',
              services: [{ description: '', internalId: '', manHours: '', price: '', total: '' }],
            });
          }}
          onRemove={() => removeField(index)}
        />
      ))}
    </>
  );
};
