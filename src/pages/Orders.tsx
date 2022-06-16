import {
  Button,
  Flex,
  Heading,
  HStack,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { BsSearch } from "react-icons/bs";
import { AddressCard } from "../components/AddressCard";
import { CartItems } from "../components/CartItems";
import { OrderRow } from "../components/OrderRow";
import { StateComponent } from "../components/StateComponent";
import { UserCard } from "../components/UserCard";
import { useSearchIndex } from "../hooks/useSearchIndex";
import { DeliveryStatus, Order } from "../types/Product";

export const Orders = () => {
  const {
    data: orders,
    setData,
    setPage,
    setQuery,
    page,
    pageStat,
    loading,
  } = useSearchIndex<Order[]>("confirmedOrders");
  const [selectedOrder, setSelectedOrder] = useState<Order>();
  const {
    isOpen: isUserModalOpen,
    onClose: onCloseUserModal,
    onOpen: onOpenUserModal,
  } = useDisclosure();
  const {
    isOpen: isAddressModalOpen,
    onClose: onCloseAddressModal,
    onOpen: onOpenAddressModal,
  } = useDisclosure();
  const {
    isOpen: isCartModalOpen,
    onClose: onCloseCartModal,
    onOpen: onOpenCartModal,
  } = useDisclosure();

  const setDeliveryDate = (i: number) => {
    return (deliverydate: string) => {
      const neworders = [...(orders || [])];
      neworders[i].deliveryDate = new Date(deliverydate).getTime();
      setData(neworders);
    };
  };
  const [searchInput, setSearchInput] = useState<string>("");

  const onViewDeliveryAddress = (order: Order) => {
    setSelectedOrder(order);
    onOpenAddressModal();
  };
  const onEnterQuery = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.keyCode === 13) {
      setQuery(searchInput);
    }
  };
  const onOpenUserInfo = (order: Order) => {
    setSelectedOrder(order);
    onOpenUserModal();
  };
  const onOpenCart = (order: Order) => {
    setSelectedOrder(order);
    onOpenCartModal();
  };

  const setDeliveryStatus = (i: number) => {
    return (deliveryStatus: DeliveryStatus) => {
      const neworders = [...(orders || [])];
      neworders[i].deliveryStatus = deliveryStatus;
      setData(neworders);
    };
  };

  const nexpage = () => {
    if (!pageStat?.pages || pageStat.currentPage == undefined) return;

    if (page < pageStat?.pages) {
      setPage(pageStat?.currentPage + 1);
    }
  };

  if (loading)
    return <StateComponent loading={true} loadingText="fetchingOrders" />;
  return orders?.length ? (
    <Flex direction="column" px={5}>
      <Heading my={3} fontSize="xl" mb={5} ml={5}>
        Manage Orders
      </Heading>
      <HStack mx={5} my={8}>
        <Icon fontSize="lg" as={BsSearch} />
        <Input
          placeholder="Search CartItem, orderId, deliveryStatus"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyUp={onEnterQuery}
        />
      </HStack>
      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th>Order Id</Th>
              <Th>Date</Th>
              <Th>Status</Th>
              <Th>Amount</Th>
              <Th>Delivery Date</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {orders.length ? (
              orders.map((order, i) => (
                <OrderRow
                  setStatus={setDeliveryStatus(i)}
                  order={order}
                  key={`order-row-${i}`}
                  setDeliveryDate={setDeliveryDate(i)}
                  onViewDeliveryAddress={() => onViewDeliveryAddress(order)}
                  onViewUserInfo={() => onOpenUserInfo(order)}
                  onViewCartInfo={() => onOpenCart(order)}
                />
              ))
            ) : (
              <Tr textAlign="center" py={5}>
                <Td colSpan={5}>There are no orders yet</Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </TableContainer>
      <Flex my={5} justifyContent="center" alignItems="center">
        {
          <Button
            variant="outline"
            colorScheme="brand"
            disabled={
              pageStat?.pages && pageStat.currentPage
                ? pageStat.pages <= pageStat.currentPage
                : true
            }
            onClick={nexpage}
          >
            Next
          </Button>
        }
      </Flex>
      <Modal isOpen={isUserModalOpen} onClose={onCloseUserModal} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>👨🏿 User Info</ModalHeader>
          <ModalBody>
            <UserCard userId={selectedOrder?.userId || ""} />
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal
        isOpen={isAddressModalOpen}
        onClose={onCloseAddressModal}
        size="md"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>🚚 Delivery Address</ModalHeader>
          <ModalBody>
            <AddressCard address={selectedOrder?.billing} />
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal isOpen={isCartModalOpen} onClose={onCloseCartModal} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>🛒 Cart</ModalHeader>
          <ModalBody>
            <CartItems cart={selectedOrder?.cart} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  ) : (
    <StateComponent loading={false} />
  );
};
