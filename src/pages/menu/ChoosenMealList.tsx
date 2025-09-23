import { Divider, List, ListItem, ListItemText } from '@mui/material';
import type { TypographyStyle } from '@mui/material/styles';

const style: TypographyStyle = {
  width: '100%',
  maxWidth: '600px',
  borderStyle: 'solid',
  borderWidth: '1px',
  borderColor: 'grey',
};

const styleListItemTextPrice = { textAlign: 'end' };

interface Meal {
  id: number;
  name: string;
  price: number;
}
interface Props {
  list: Meal[];
  totalPrice: number;
}
function ChoosenMealList(props: Props) {
  //   const [totalPrice, setTotalPrice] = useState(0);
  //   let totalPrice = 0;
  //   const countTotal = (price: number) => {
  //     totalPrice = totalPrice + price;
  //   };
  return (
    <>
      <List sx={style}>
        {props.list.map(item => {
          return (
            <ListItem key={item.id}>
              <ListItemText>{item.name}</ListItemText>
              <ListItemText sx={styleListItemTextPrice}>{item.price}</ListItemText>
            </ListItem>
          );
        })}
        <Divider />
        <ListItem key="total">
          <ListItemText>Загальна сума</ListItemText>
          <ListItemText sx={styleListItemTextPrice}>{props.totalPrice}</ListItemText>
        </ListItem>
      </List>
    </>
  );
}
export default ChoosenMealList;
