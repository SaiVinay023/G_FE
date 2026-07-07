'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  IconButton,
  Button,
} from '@mui/material';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import UploadRoundedIcon from '@mui/icons-material/UploadRounded';
import { useTranslations } from 'next-intl';

const CommunicationsTab: React.FC = () => {
  // translations
  const t = useTranslations();                 // root — has "messages"
  const tMessages = useTranslations('Messages');       // has "tabs"
  const tForm = useTranslations('MessagesForm');       // has "upload_image", "send_message"
  const tSend = useTranslations('SendMessageModal');   // has "type_your_message_here"
  const tCustomers = useTranslations('customers');     // has "templates"

  // local state
  const [template, setTemplate] = useState<string>('');   // e.g. '', 'thankyou', 'reminder'
  const [message, setMessage] = useState<string>('');

  const handleSend = () => {
    // TODO: hook up to your send action
    // console.log({ template, message });
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {t('messages')}
      </Typography>

      <Box display="flex" gap={3} flexWrap="wrap" mt={2}>
        {/* Left: composer */}
        <Paper elevation={0} sx={{ flex: 1, minWidth: 300, borderRadius: 3, p: 2, bgcolor: 'background.default' }}>
          <Stack gap={2}>
            <Stack direction="row" gap={1} alignItems="flex-start">
              <FormControl fullWidth>
                <InputLabel id="template-label">{tCustomers('templates')}</InputLabel>
                <Select
                  labelId="template-label"
                  id="template"
                  value={template}
                  label={tCustomers('templates')}
                  onChange={(e) => setTemplate(String(e.target.value))}
                  size="small"
                >
                  <MenuItem value="">{tCustomers('templates')}</MenuItem>
                  <MenuItem value="thankyou">Thank you</MenuItem>
                  <MenuItem value="reminder">Reminder</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                multiline
                minRows={3}
                placeholder={tSend('type_your_message_here')}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                size="small"
              />

              <IconButton
                onClick={handleSend}
                color="primary"
                sx={{
                  width: 40,
                  height: 40,
                  border: '2px solid',
                  borderColor: 'primary.light',
                  bgcolor: 'background.paper',
                }}
                aria-label={tForm('send_message')}
              >
                <SendRoundedIcon />
              </IconButton>
            </Stack>

            <Button
              variant="outlined"
              startIcon={<UploadRoundedIcon />}
              sx={{ alignSelf: 'flex-start', fontWeight: 700 }}
            >
              {tForm('upload_image')}
            </Button>
          </Stack>
        </Paper>

        {/* Right: placeholder for message tabs/list */}
        <Paper elevation={0} sx={{ flex: 1, minWidth: 200, borderRadius: 3, p: 2, bgcolor: 'background.default' }}>
          <Typography>{tMessages('tabs')}</Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default CommunicationsTab;
