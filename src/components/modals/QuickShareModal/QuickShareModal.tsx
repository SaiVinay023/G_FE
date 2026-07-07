import { FC, useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Tabs,
  Tab,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { MuiTelInput } from 'mui-tel-input';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { quickShareSchema } from 'src/schemas/quickShare.schema';
import { z } from 'zod';
import { useTranslations } from 'next-intl';


interface QuickShareModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    email: string;
    subject: string;
    body: string;
    channel: 'whatsapp' | 'sms' | 'email';
    phone?: string;
  }) => void;
  isSubmitting?: boolean;
}
type QuickShareForm = z.infer<typeof quickShareSchema>;


export const QuickShareModal: FC<QuickShareModalProps> = ({
  open,
  onClose,
  onSubmit,
  isSubmitting,
}) => {
  const t = useTranslations('QuickShareModal');
  const tabTranslations = [
  t('tabs.whatsapp'),
  t('tabs.sms'),
  t('tabs.email')
    ] as const;
  type ChannelType = (typeof tabTranslations)[number];
  const [selectedTab, setSelectedTab] = useState(2); // Default to Email

  const currentChannel = tabTranslations[selectedTab].toLowerCase() as ChannelType;

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    trigger,
    formState: { errors },
  } = useForm<QuickShareForm>({
    resolver: zodResolver(quickShareSchema),
    defaultValues: {
      email: '',
      phone: '',
       subject: t('fields.subjectDefault'),
      body: t('fields.bodyDefault'),
      channel: 'email',
    },
  });




  const handleTabChange = async (_: any, newIndex: number) => {
    const newChannel = tabTranslations[newIndex].toLowerCase() as ChannelType;
    setSelectedTab(newIndex);
    setValue('channel', newChannel, { shouldValidate: true });
  
  // Reset validation for fields that won't be used
  if (newChannel === 'email') {
    setValue('phone', '', { shouldValidate: false });
  } else {
    setValue('email', '', { shouldValidate: false });
  }
};

  const onFormSubmit = (data: QuickShareForm) => {
    const finalData = {
      ...data,
      message: data.body,
      channel: currentChannel,
    };

    onSubmit(finalData);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          maxHeight: '90vh',
          overflowY: 'auto',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 1,
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">{t('title')}</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Typography variant="body1" mb={2}>
          {t('description')}
        </Typography>

        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ mb: 2 }}
        >
          {tabTranslations.map((label) => (
            <Tab key={label} label={label} />
          ))}
        </Tabs>

        <form onSubmit={handleSubmit(onFormSubmit, (err) => console.log("Validation errors:", err))} noValidate>
          {(currentChannel === 'whatsapp' || currentChannel === 'sms') && (
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <MuiTelInput
                  {...field}
                  label={t('fields.phone')}
                  defaultCountry="US"
                  fullWidth
                  margin="normal"
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                />
              )}
            />
          )}

          {currentChannel === 'email' && (
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={t('fields.email')}
                  fullWidth
                  margin="normal"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              )}
            />
          )}

          <Controller
            name="subject"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={t('fields.subject')}
                fullWidth
                required
                margin="normal"
                error={!!errors.subject}
                helperText={errors.subject?.message}
              />
            )}
          />

          <Controller
            name="body"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={t('fields.body')}
                fullWidth
                required
                multiline
                rows={4}
                margin="normal"
                error={!!errors.body}
                helperText={errors.body?.message}
              />
            )}
          />

          <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
            <Button variant="outlined" onClick={onClose} type="button">
             {t('buttons.cancel')}
            </Button>
            <Button variant="contained" type="submit" disabled={isSubmitting}>
               {isSubmitting ? t('buttons.sending') : t('buttons.send')}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};
