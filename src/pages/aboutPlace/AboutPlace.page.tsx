import { useEffect, useRef, useState } from 'react';
import { AboutApi } from '../../api/services/about';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  TextField,
} from '@mui/material';

interface AboutData {
  id?: number;
  facebook: string;
  instagram: string;
  email: string;
  phone: string;
  about_description: string;
}

const contactsList: { id: keyof AboutData; name: string; defoult: string }[] = [
  { id: 'facebook', name: 'Facebook', defoult: 'Додати посилання на facebook' },
  { id: 'instagram', name: 'Instagram', defoult: 'Додати посилання на instagram' },
  { id: 'phone', name: 'Телефон', defoult: 'Додати телефон для замовлень' },
  { id: 'email', name: 'Електронна пошта', defoult: 'Додати електронну пошту' },
];
const aboutApi = new AboutApi();
function AboutPlace() {
  const [data, setData] = useState<AboutData>({
    id: 1,
    facebook: '',
    instagram: '',
    email: '',
    phone: '',
    about_description: '',
  });
  const notfirstRequest = useRef(true);
  const [openDialog, setOpenDialog] = useState<keyof AboutData | null>(null);
  const [dialogItem, setDialogItem] = useState<(typeof contactsList)[number] | undefined>(
    undefined,
  );

  useEffect(() => {
    if (!openDialog) {
      setDialogItem(undefined);
    } else {
      setDialogItem(contactsList.find(({ id }) => id === openDialog));
    }
  }, [openDialog]);
  const updateDataElement = (key: string, value: string) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    if (!notfirstRequest.current) return;

    notfirstRequest.current = false;
    aboutApi
      .getAbout()
      .then(data => data && setData(prev => ({ ...prev, ...data })))
      .catch(err => {
        console.log(err);
      });
  }, []);

  const openContactItem = (id: keyof AboutData) => {
    setOpenDialog(id);
  };
  const closeContactItem = () => setOpenDialog(null);
  const onSave = () => {
    const saveData = { ...data };
    delete saveData.id;
    aboutApi
      .updateAbout(saveData)
      .then(data => {
        console.log(data);
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <>
      <Box>
        <h2>Контактна інформація</h2>
        <List
          sx={{
            width: '100%',
            borderRadius: '25px',
            borderStyle: 'solid',
            borderWidth: '1px',
            padding: 0,
          }}
        >
          {contactsList.map(({ id, defoult }, index, arr) => {
            let radius = {};
            switch (index) {
              case 0:
                radius = { borderTopLeftRadius: '25px', borderTopRightRadius: '25px' };
                break;

              case arr.length - 1:
                radius = {
                  borderBottomLeftRadius: '25px',
                  borderBottomRightRadius: '25px',
                };
                break;
              default:
                radius = {};
                break;
            }
            return (
              <ListItem key={id} sx={{ minWidth: '400px', minHeight: '50px' }} disablePadding>
                <ListItemButton
                  style={{ borderRadius: 0, ...radius }}
                  sx={{
                    boxSizing: 'border-box',
                    minHeight: '50px',
                  }}
                  role={undefined}
                  onClick={() => openContactItem(id)}
                  dense
                >
                  <ListItemText>{data[id] || defoult}</ListItemText>
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
        {!!openDialog && (
          <Dialog open={!!openDialog} onClose={closeContactItem} maxWidth="sm" fullWidth>
            <DialogTitle>{dialogItem?.name}</DialogTitle>
            <DialogContent>
              <DialogContentText>{dialogItem?.defoult}</DialogContentText>
              <TextField
                id="outlined-basic"
                label={dialogItem?.name}
                variant="outlined"
                sx={{ width: '100%' }}
                type={(() => {
                  switch (openDialog) {
                    case 'email':
                      return 'email';
                    case 'phone':
                      return 'tel';
                    default:
                      return 'url';
                  }
                })()}
                value={data[openDialog]}
                onChange={e => updateDataElement(openDialog, e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={closeContactItem}>Закрити</Button>
            </DialogActions>
          </Dialog>
        )}
        <h2>Про Заклад</h2>

        <TextField
          id="outlined-multiline-static"
          label="Про заклад"
          multiline
          rows={7}
          fullWidth
          value={data['about_description']}
          onChange={e => updateDataElement('about_description', e.target.value)}
          sx={{ marginBottom: '20px' }}
        />

        <Button onClick={onSave} variant="outlined">
          Зберегти
        </Button>
      </Box>
    </>
  );
}

export default AboutPlace;
