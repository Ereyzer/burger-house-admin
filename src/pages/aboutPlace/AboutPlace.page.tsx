import React, { useEffect, useRef, useState } from 'react';
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
  Typography,
} from '@mui/material';
import type { OpenDay } from './interface';

interface AboutData {
  id?: number;
  facebook: string;
  instagram: string;
  email: string;
  phone: string;
  placeDescription: string;
  placeAddress: string;
  opennigHours: { [key: number]: OpenDay };
}
const defoultOpennigHoursArr: OpenDay[] = [
  { dayOfWeek: 0, opensAt: null, closesAt: null },
  { dayOfWeek: 1, opensAt: null, closesAt: null },
  { dayOfWeek: 2, opensAt: null, closesAt: null },
  { dayOfWeek: 3, opensAt: null, closesAt: null },
  { dayOfWeek: 4, opensAt: null, closesAt: null },
  { dayOfWeek: 5, opensAt: null, closesAt: null },
  { dayOfWeek: 6, opensAt: null, closesAt: null },
];

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
    placeDescription: '',
    placeAddress: '',
    opennigHours: { 0: defoultOpennigHoursArr[0] },
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
      .then(data => {
        return (
          data &&
          setData(prev => ({
            ...prev,
            facebook: data.facebook || '',
            instagram: data.instagram || '',
            email: data.email || '',
            phone: data.phone || '',
            placeDescription: data.placeDescription || '',
            placeAddress: data.placeAddress || '',
            opennigHours: [...data.openningHours].reduce((acc, item) => {
              acc = { ...acc, [item.dayOfWeek]: item };
              return acc;
            }, {}),
          }))
        );
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  const openContactItem = (id: keyof AboutData) => {
    setOpenDialog(id);
  };
  const closeContactItem = () => setOpenDialog(null);
  const onSave = () => {
    const saveData = {
      facebook: data.facebook || null,
      instagram: data.instagram || null,
      email: data.email || null,
      phone: data.phone || null,
      placeDescription: data.placeDescription || null,
      placeAddress: data.placeAddress || null,
    };

    aboutApi
      .updateAbout(saveData)
      .then()
      .catch(err => {
        console.log(err);
      });
  };

  const changeOpenHours = (value: string, id: number) => {
    setData(prev => ({
      ...prev,
      opennigHours: { ...prev.opennigHours, [id]: { ...prev.opennigHours[id], opensAt: value } },
    }));
  };
  const changeCloseHours = (value: string, id: number) => {
    setData(prev => ({
      ...prev,
      opennigHours: { ...prev.opennigHours, [id]: { ...prev.opennigHours[id], closesAt: value } },
    }));
  };

  const saveDayOpeningTime = (data: OpenDay) => {
    aboutApi
      .updateOpenigHours(data)
      .then()
      .catch(err => {
        console.log(err);
      });
  };
  const resetOpeningTime = (dayOfWeek: number) => {
    aboutApi
      .updateOpenigHours({
        dayOfWeek,
        opensAt: null,
        closesAt: null,
      })
      .then(() => {
        setData(prev => ({
          ...prev,
          opennigHours: {
            ...prev.opennigHours,
            [dayOfWeek]: {
              dayOfWeek,
              opensAt: null,
              closesAt: null,
            },
          },
        }));
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
                  {<ListItemText>{id || defoult}</ListItemText>}
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
        <h2>Адреса</h2>
        <TextField
          multiline
          rows={3}
          fullWidth
          value={data.placeAddress}
          onChange={e => updateDataElement('placeAddress', e.target.value)}
          sx={{ marginBottom: '20px' }}
        ></TextField>

        <h2>Про Заклад</h2>

        <TextField
          label="Про заклад"
          multiline
          rows={7}
          fullWidth
          value={data.placeDescription}
          onChange={e => updateDataElement('placeDescription', e.target.value)}
          sx={{ marginBottom: '20px' }}
        />

        <Button onClick={onSave} variant="outlined">
          Зберегти
        </Button>

        <h2>Години роботи</h2>
        <List>
          {...Object.values(data.opennigHours)
            .reverse()
            .reduce((acc, i) => {
              let day = '';
              switch (i.dayOfWeek) {
                case 0:
                  day = 'Неділя';
                  break;

                case 1:
                  day = 'Понеділок';
                  break;

                case 2:
                  day = 'Вівторрок';
                  break;

                case 3:
                  day = 'Середа';
                  break;

                case 4:
                  day = 'Четвер';
                  break;

                case 5:
                  day = "П'ятниця";
                  break;
                case 6:
                  day = 'Субота';
                  break;
              }

              const element = (
                <ListItem
                  key={i.dayOfWeek}
                  sx={{ width: '600px', display: 'flex', justifyContent: 'space-between' }}
                >
                  <Typography sx={{ width: '40px' }}>{day}</Typography>
                  <TextField
                    type="time"
                    value={i.opensAt || ''}
                    label={'З '}
                    onChange={e => changeOpenHours(e.target.value, i.dayOfWeek)}
                  />
                  <TextField
                    type="time"
                    value={i.closesAt || ''}
                    onChange={e => changeCloseHours(e.target.value, i.dayOfWeek)}
                    label="По "
                  />
                  <Button onClick={() => resetOpeningTime(i.dayOfWeek)}>Скинути</Button>
                  <Button onClick={() => saveDayOpeningTime(i)}>Зберегти</Button>
                </ListItem>
              );

              if (i.dayOfWeek === 0) {
                acc.push(element);
              } else {
                acc.unshift(element);
              }
              return acc;
            }, [] as React.ReactElement[])}
        </List>

        <h2>Ціна доставки</h2>
      </Box>
    </>
  );
}

export default AboutPlace;
