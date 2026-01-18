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
} from '@mui/material';
import type { BrakeTime, DeliveryPrice, OpenDay } from './interface';
import BrakeTimesList from './BrakeTimesList';
import DeliveryPriceList from './deliveryPrices';
import OneDayWorkHour from './OneDayWorkHour';

interface AboutData {
  id?: number;
  facebook: string;
  instagram: string;
  email: string;
  phone: string;
  placeDescription: string;
  placeAddress: string;
  openningHours: { [key: number]: OpenDay };
  brakeTimes: { workDate: string; closesAt: string; opensAt: string; id: string }[];
  deliveryPrices: DeliveryPrice[];
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
    openningHours: { 0: defoultOpennigHoursArr[0] },
    brakeTimes: [],
    deliveryPrices: [],
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
            openningHours: [...data.openningHours].reduce((acc, item) => {
              acc = { ...acc, [item.dayOfWeek]: item };
              return acc;
            }, {}),
            brakeTimes: data.brakeTimes,
            deliveryPrices: data.deliveryPrices,
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
          openningHours: {
            ...prev.openningHours,
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

  const addBrakeTime = (brakeTime: Omit<BrakeTime, 'id'>) => {
    const testValues = Object.values(brakeTime);
    if (testValues.includes('')) return;
    aboutApi
      .addBrakeTime(brakeTime)
      .then(data => {
        setData(prev => ({ ...prev, brakeTimes: [data, ...prev.brakeTimes] }));
      })
      .catch();
  };

  const rmBrakeTime = (id: string) => {
    aboutApi
      .rmBrakeTime(id)
      .then(() => {
        setData(prev => ({
          ...prev,
          brakeTimes: [...prev.brakeTimes].filter(item => item.id !== id),
        }));
      })
      .catch();
  };

  const addDeliveryPrice = (newPrice: Omit<DeliveryPrice, 'id'>) => {
    aboutApi
      .addDeliveryPrice(newPrice)
      .then(resp => {
        setData(prev => ({
          ...prev,
          deliveryPrices: [resp, ...prev.deliveryPrices].sort((a, b) => a.distance - b.distance),
        }));
      })
      .catch();
  };
  const rmDeliveryPrice = (id: string) => {
    aboutApi
      .rmDeliveryPrices(id)
      .then(() => {
        setData(prev => ({
          ...prev,
          deliveryPrices: [...prev.deliveryPrices].filter(a => a.id !== id),
        }));
      })
      .catch();
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
          {...Object.values(data.openningHours)
            .reverse()
            .reduce((acc, i) => {
              const element = (
                <OneDayWorkHour
                  oneDay={i}
                  saveDayOpeningTime={saveDayOpeningTime}
                  resetOpeningTime={resetOpeningTime}
                />
              );

              if (i.dayOfWeek === 0) {
                acc.push(element);
              } else {
                acc.unshift(element);
              }
              return acc;
            }, [] as React.ReactElement[])}
        </List>
        <h2>Перерви</h2>
        <BrakeTimesList
          items={data.brakeTimes}
          addBrakeTime={addBrakeTime}
          rmBrakeTime={rmBrakeTime}
        />

        <h2>Ціна доставки</h2>
        <DeliveryPriceList
          prices={data.deliveryPrices}
          addDeliveryPrice={addDeliveryPrice}
          rmDeliveryPrice={rmDeliveryPrice}
        />
      </Box>
    </>
  );
}

export default AboutPlace;
