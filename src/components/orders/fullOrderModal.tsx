import { Box, Button, List, ListItem, Typography } from '@mui/material';
import type { FullOrder } from './interface';
import type { PaymentMethod, Status } from './types';

interface Props {
  order: FullOrder;
  handleStatus: (id: string, status: Status) => void;
  onClose: () => void;
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  minWidth: '80%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const statusButtonText = (status: Status) => {
  switch (status) {
    case 'pending':
      return 'В роботу';

    case 'processing':
      return 'В дорозі';
    case 'shipped':
      return 'Доставленно';
    case 'delivered':
      return '';
    case 'cancelled':
      return '';
  }
};
const flexBoxStyles = { display: 'flex', justifyContent: 'space-between' };

const PaymentType: Record<PaymentMethod, string> = {
  CARD_ON_DELIVERY: 'Карткою при отриманні',
  CASH_ON_DELIVERY: 'Готівкою при отриманні',
  CARD_ONLINE: 'Карткою онлайн',
  BANK_TRANSFER: 'Банківський переказ',
  PAYPAL: 'PayPal',
  APPLE_PAY: 'Apple Pay',
  GIFT_CARD: 'Подарункова картка',
};
function FullOrderModal({ order, handleStatus, onClose }: Props) {
  return (
    <Box sx={style}>
      <Box sx={flexBoxStyles}>
        <Typography>Замовлення №</Typography>
        <Typography>{order.id}</Typography>
      </Box>
      <List>
        {order.selections.map(({ selection, quantity }) => (
          <ListItem key={selection.id} sx={{ width: '100%', ...flexBoxStyles }}>
            <Typography>
              {selection.title} {selection.subtitle} X {quantity}
            </Typography>
            <Typography>{selection.price}</Typography>
          </ListItem>
        ))}
      </List>
      <Box sx={flexBoxStyles}>
        <Typography>До сплати</Typography>
        <Typography>{order.amount}</Typography>
      </Box>
      <Box sx={flexBoxStyles}>
        <Typography>Ім'я</Typography>
        <Typography>{order.customerName}</Typography>
      </Box>
      <Box>
        <Box sx={flexBoxStyles}>
          <Typography>Телефон</Typography>
          <Typography>{order.phone}</Typography>
        </Box>
        <Box sx={flexBoxStyles}>
          <Typography>Отримання</Typography>
          <Typography>{order.delivery ? 'За Адресою' : 'В Закладі'}</Typography>
        </Box>
        {order.delivery && (
          <Box sx={flexBoxStyles}>
            <Typography>Адреса</Typography>
            <Typography>{order.addressFull}</Typography>
          </Box>
        )}
        {order.addressClarification && (
          <Box sx={flexBoxStyles}>
            <Typography>Уточнення по адресі</Typography>
            <Typography>{order.addressClarification}</Typography>
          </Box>
        )}
        {order.description && (
          <Box sx={flexBoxStyles}>
            <Typography>Примітка до замовлення</Typography>
            <Typography>{order.description}</Typography>
          </Box>
        )}
        {order.payment && (
          <Box sx={flexBoxStyles}>
            <Typography>Оплата</Typography>
            <Typography>{PaymentType[order.payment]}</Typography>
          </Box>
        )}
      </Box>
      <Box sx={flexBoxStyles}>
        <Button onClick={onClose}>Закрити</Button>
        {order.status !== 'delivered' && (
          <Button
            variant="contained"
            onClick={() =>
              handleStatus(
                order.id,
                (order.status === 'pending' && 'processing') ||
                  (order.status === 'processing' && 'shipped') ||
                  (order.status === 'shipped' && 'delivered') ||
                  'cancelled',
              )
            }
            // disabled={order.status === 'delivered' || order.status === 'cancelled'}
          >
            {statusButtonText(order.status)}
          </Button>
        )}
        <Button onClick={onClose} disabled={true}>
          Відміна
        </Button>
      </Box>
    </Box>
  );
}
// {
//     "id": 96,
//     "createdAt": "2025-10-29T09:00:23.482Z",
//     "updatedAt": "2025-10-29T09:00:23.482Z",
//     "payment": "CARD_ONLINE",
//     "amount": 0,
//     "phone": "956937164",
//     "customerName": "string",
//     "delivery": false,
//     "street": "",
//     "status": "pending",
//     "addressFull": null,
//     "addressClarification": "string",
//     "description": "string",
//     "email": "string@gmail.com",
//     "selections": [
//         {
//             "order_id": 96,
//             "menu_id": 1,
//             "quantity": 1,
//             "createdAt": "2025-10-29T09:00:23.482Z",
//             "selection": {
//                 "id": 1,
//                 "title": "Пепсі",
//                 "subtitle": "",
//                 "price": 0.03,
//                 "onboard": true,
//                 "image_small": null,
//                 "image_medium": "http://res.cloudinary.com/dwqi1fkfb/image/upload/v1760786565/1760786563503-pepsi.jpg",
//                 "description": "",
//                 "rating": null,
//                 "calories": 1,
//                 "categories": [
//                     {
//                         "id": "drink",
//                         "display_name": "Напої",
//                         "description": ""
//                     }
//                 ],
//                 "drinks": [
//                     {
//                         "id": 1,
//                         "name": "pepsi 0.5",
//                         "price": 0.01,
//                         "calories": 1,
//                         "description": null
//                     }
//                 ],
//                 "dishes": []
//             }
//         },
//         {
//             "order_id": 96,
//             "menu_id": 2,
//             "quantity": 3,
//             "createdAt": "2025-10-29T09:00:23.482Z",
//             "selection": {
//                 "id": 2,
//                 "title": "Пепсі 0.5",
//                 "subtitle": "",
//                 "price": 0.03,
//                 "onboard": true,
//                 "image_small": null,
//                 "image_medium": "http://res.cloudinary.com/dwqi1fkfb/image/upload/v1760786588/1760786587716-car.jpg",
//                 "description": "",
//                 "rating": null,
//                 "calories": 1,
//                 "categories": [
//                     {
//                         "id": "drink",
//                         "display_name": "Напої",
//                         "description": ""
//                     }
//                 ],
//                 "drinks": [
//                     {
//                         "id": 1,
//                         "name": "pepsi 0.5",
//                         "price": 0.01,
//                         "calories": 1,
//                         "description": null
//                     }
//                 ],
//                 "dishes": []
//             }
//         },
//         {
//             "order_id": 96,
//             "menu_id": 8,
//             "quantity": 1,
//             "createdAt": "2025-10-29T09:00:23.482Z",
//             "selection": {
//                 "id": 8,
//                 "title": "Чипси",
//                 "subtitle": "сир",
//                 "price": 0.03,
//                 "onboard": true,
//                 "image_small": null,
//                 "image_medium": null,
//                 "description": "",
//                 "rating": null,
//                 "calories": 1,
//                 "categories": [
//                     {
//                         "id": "snack",
//                         "display_name": "Снеки",
//                         "description": "якісь смаколики"
//                     }
//                 ],
//                 "drinks": [],
//                 "dishes": [
//                     {
//                         "id": 1,
//                         "price": 0.01,
//                         "name": "Чипси"
//                     }
//                 ]
//             }
//         }
//     ]
// }
export default FullOrderModal;
