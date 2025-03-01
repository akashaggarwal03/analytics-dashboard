import React, { useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Dialog, DialogTitle, DialogContent, IconButton, Link } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

export const Instructions: React.FC = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ mt: 4, px: 2, textAlign: 'center' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
        <Typography variant="h5" sx={{ color: 'primary.main', mr: 1 }}>
          How to Get Your YouTube Watch History from{' '}
          <Link
            href="https://takeout.google.com/settings/takeout"
            target="_blank"
            rel="noopener noreferrer"
            color="primary"
            underline="hover"
          >
            Google Takeout
          </Link>
        </Typography>
        <IconButton onClick={handleOpen} color="primary" aria-label="Show instructions">
          <HelpOutlineIcon />
        </IconButton>
      </Box>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          How to Get Your YouTube Watch History from{' '}
          <Link
            href="https://takeout.google.com/settings/takeout"
            target="_blank"
            rel="noopener noreferrer"
            color="primary"
            underline="hover"
          >
            Google Takeout
          </Link>
          <IconButton
            onClick={handleClose}
            sx={{ position: 'absolute', right: 8, top: 8, color: '#888' }}
            aria-label="Close dialog"
          >
            <Typography variant="body1">✕</Typography>
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2, color: 'text.secondary' }}>
            Follow these steps to download your YouTube watch history and upload it here to see your personalized insights!
          </Typography>
          <List sx={{ textAlign: 'left' }}>
            <ListItem>
              <ListItemText
                primary={
                  <>
                    1. Navigate to{' '}
                    <Link
                      href="https://takeout.google.com/settings/takeout"
                      target="_blank"
                      rel="noopener noreferrer"
                      color="primary"
                      underline="hover"
                    >
                      Google Takeout
                    </Link>
                    .
                  </>
                }
              />
            </ListItem>
            <ListItem>
              <ListItemText primary="2. If prompted, log in to the Google account from which you want to retrieve YouTube watch history." />
            </ListItem>
            <ListItem>
              <ListItemText primary="3. Click 'Deselect all'." />
            </ListItem>
            <ListItem>
              <ListItemText primary="4. Scroll to the bottom and click the checkbox for 'YouTube and YouTube Music'." />
            </ListItem>
            <ListItem>
              <ListItemText primary="5. Click 'All YouTube data included'." />
            </ListItem>
            <ListItem>
              <ListItemText primary="6. Click 'Deselect all,' then select 'history'. Click OK." />
            </ListItem>
            <ListItem>
              <ListItemText primary="7. Click 'Multiple formats,' then, next to 'History,' click 'HTML' and change it to 'JSON'. Click OK." />
            </ListItem>
            <ListItem>
              <ListItemText primary="8. Click 'Next step,' then 'Create export'." />
            </ListItem>
            <ListItem>
              <ListItemText primary="9. You may wait on this page until it is finished, or you can wait for the email indicating it is complete." />
            </ListItem>
            <ListItem>
              <ListItemText primary="10. Once it is complete, download the zip file. Unzip the file, and find the watch-history.json file. You can find it in Takeout/YouTube and YouTube Music/history." />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={
                  <>
                    We don't save any data; in fact, we don't have any DB connection in our{' '}
                    <Link
                      href="https://github.com/akashaggarwal03/analytics-dashboard"
                      target="_blank"
                      rel="noopener noreferrer"
                      color="primary"
                      underline="hover"
                    >
                      Code
                    </Link>
                    .
                  </>
                }
              />
            </ListItem>
          </List>
        </DialogContent>
      </Dialog>
    </Box>
  );
};