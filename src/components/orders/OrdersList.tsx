import {
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import OrderRow from './orderRow';
import { OrdersApi } from '../../api/services/orders';
import type { Status } from './types';
import FullOrderModal from './fullOrderModal';
import type { FullOrder } from './interface';
import { useAppDispatch, useAppSelector } from '../../store';
import { getAllOrders, updateOrderStatus } from '../../store/reducers/orders.reducer';
import { socket } from '../../socket/orders';

const ordersApi = new OrdersApi();

function OrdersList() {
  const { orders } = useAppSelector(state => state.orders);
  const dispatch = useAppDispatch();
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [openOrder, setOpenOrder] = useState<null | FullOrder>(null);

  useEffect(() => {
    dispatch(getAllOrders({ page, perPage }));
  }, [page, perPage, dispatch]);

  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);
  const handleChangePerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPerPage(parseInt(event.target.value));
  };
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };
  const clickOnRow = (id: number) => {
    ordersApi
      .getOneById(id)
      .then(res => {
        setOpenOrder(res);
      })
      .catch();
  };

  const handleCloseOrderModal = () => {
    setOpenOrder(null);
  };

  const handleStatus = (id: number, status: Status) => {
    dispatch(updateOrderStatus({ id, status })).then(res => {
      if (res.meta.requestStatus === 'fulfilled') {
        setOpenOrder(prev => {
          if (!prev) return null;
          return { ...prev, status };
        });
      }
    });
  };

  return (
    <>
      <Paper>
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell align="left" padding="normal">
                  Статус
                </TableCell>
                <TableCell align="center" padding="normal">
                  Замовник
                </TableCell>
                <TableCell align="center" padding="normal">
                  Телефон
                </TableCell>
                <TableCell align="center" padding="normal">
                  Отримання
                </TableCell>
                <TableCell align="center" padding="normal">
                  Час Замовлення
                </TableCell>
                <TableCell align="right" padding="normal">
                  Часу минуло
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* {orders[0] && (
            <OrderRow
              key={0}
              id={orders[0].id}
              status={orders[0].status}
              customerName={orders[0].customerName}
              isDelivery={orders[0].delivery}
              orderedAt={orders[0].createdAt}
              phone={orders[0].phone}
            />
          )} */}
              {orders.items.map((order, index) => (
                <OrderRow
                  key={index}
                  id={order.id}
                  status={order.status}
                  customerName={order.customerName}
                  isDelivery={order.delivery}
                  orderedAt={order.createdAt}
                  phone={order.phone}
                  clickOnRow={clickOnRow}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[1, 5, 10, 25, 50, 100]}
          component="div"
          count={orders.totalItems}
          rowsPerPage={perPage}
          page={orders.page}
          onRowsPerPageChange={handleChangePerPage}
          onPageChange={handleChangePage}
        />
      </Paper>
      {openOrder && (
        <Modal open={!!openOrder} onClose={handleCloseOrderModal}>
          <FullOrderModal
            order={openOrder}
            handleStatus={handleStatus}
            onClose={handleCloseOrderModal}
          />
        </Modal>
      )}
    </>
  );
}

export default OrdersList;
