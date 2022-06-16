import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Thead,
  Tr,
  Image,
  HStack,
  Text,
  Th,
} from "@chakra-ui/react";
import React, { FC, useMemo } from "react";
import { Order } from "../types/Product";
type CartItemsProps = {
  cart: Order["cart"] | undefined;
};
export const CartItems: FC<CartItemsProps> = ({ cart }) => {
  const total = useMemo(() => {
    if (!cart) return 0;
    let sum = 0;
    cart.map((cart) => {
      sum += cart.price;
    });
    return sum;
  }, cart);

  return (
    <TableContainer>
      <Table>
        <Thead>
          <Tr>
            <Th>Image</Th>
            <Th>title</Th>
            <Th>quantity</Th>
            <Th>price</Th>
          </Tr>
        </Thead>
        <Tbody>
          {cart?.length ? (
            <>
              {cart.map((cartitem, i) => (
                <Tr key={`cart-row-${i}`}>
                  <Td>
                    <Image
                      width="80px"
                      height="65px"
                      src={cartitem.productImage}
                    />
                  </Td>
                  <Td>{cartitem.productName}</Td>
                  <Td>{cartitem.quantity}</Td>
                  <Td>{cartitem.price.toLocaleString()}</Td>
                </Tr>
              ))}
              <HStack my={3}>
                <Text fontWeight="bold">Total</Text>
                <Text fontWeight="bold">{total.toLocaleString()}</Text>
              </HStack>
            </>
          ) : (
            <Tr>
              <Td>No item in cart</Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
