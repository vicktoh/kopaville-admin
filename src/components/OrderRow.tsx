import {
  Button,
  Flex,
  HStack,
  Icon,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Td,
  Tooltip,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { FC, useMemo, useState } from "react";
import { BsTruck } from "react-icons/bs";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import { updateOrderDocument } from "../services/orderServices";

import { DeliveryStatus, Order } from "../types/Product";
type OrderRowProps = {
  order: Order;
  setDeliveryDate: (deliveryDate: string) => void;
  onViewCartInfo: () => void;
  setStatus: (status: DeliveryStatus) => void;
  onViewUserInfo: () => void;
  onViewDeliveryAddress: () => void;
};
export const OrderRow: FC<OrderRowProps> = ({
  order,
  setDeliveryDate,
  setStatus,
  onViewCartInfo,
  onViewUserInfo,
  onViewDeliveryAddress: onViewDeliveryStatus,
}) => {
  const [statusUpdating, setStatusUpdating] = useState<boolean>(false);
  const [deliveryUpdating, setDeliveryUpdating] = useState<boolean>(false);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const toast = useToast();
  const date = useMemo(
    () => new Date(order?.date as number).toLocaleDateString(),
    [order?.date]
  );
  const [deliveryDate, setDeliveryDateInput] = useState<string>(
    order.deliveryDate?.toString() || ""
  );

  const updateDeliveryDate = async () => {
    try {
      setDeliveryUpdating(true);
      await updateOrderDocument(
        { deliveryDate },
        order.objectID || "",
        order.userId || ""
      );
      setDeliveryDate(deliveryDate);
    } catch (error) {
      const err: any = error;
      toast({
        title: "Error Occured",
        description: err?.message || "UnknownError",
        status: "error",
      });
    } finally {
      setDeliveryUpdating(false);
      onClose();
    }
  };

  const updateDeliverStatus = async (deliveryStatus: DeliveryStatus) => {
    console.log("i am running");
    try {
      setStatusUpdating(true);
      await updateOrderDocument(
        { deliveryStatus },
        order.objectID || "",
        order.userId || ""
      );
      setStatus(deliveryStatus);
    } catch (error) {
      console.log(error);
      const err: any = error;
      toast({
        title: "Error",
        description: err?.message || "Unknown Error",
        status: "error",
      });
    } finally {
      setStatusUpdating(false);
      onClose();
    }
  };
  return (
    <Tr>
      <Td>{order.objectID}</Td>
      <Td>{date}</Td>
      <Td>
        <Menu>
          <MenuButton
            as={Button}
            isLoading={statusUpdating}
            loadingText="Updating..."
          >
            {order.deliveryStatus || "Update Delivery Status"}
          </MenuButton>
          <MenuList>
            {Object.values(DeliveryStatus).map((status, i) => (
              <MenuItem
                bg={
                  order.deliveryStatus === status ? "gray.100" : "transparent"
                }
                key={`status-${i}`}
                onClick={() => updateDeliverStatus(status)}
              >
                {status}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      </Td>
      <Td>{order.amount.toLocaleString()}</Td>
      <Td>
        <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
          <PopoverTrigger>
            <Button
              colorScheme="orange"
              loadingText="Updating..."
              isLoading={deliveryUpdating}
            >
              {order.deliveryDate
                ? new Date(order.deliveryDate as number).toLocaleDateString()
                : "Set Delivery Date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverBody py={3}>
              <Flex py={3} direction="column">
                <Input
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDateInput(e.target.value)}
                  type="date"
                  my={3}
                />
                <Button colorScheme="brand" onClick={updateDeliveryDate}>
                  Set Delivery Date
                </Button>
              </Flex>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </Td>
      <Td>
        <HStack spacing={3}>
          <Tooltip label="Delivery address">
            <IconButton
              onClick={onViewDeliveryStatus}
              colorScheme="blue"
              icon={<Icon as={BsTruck} />}
              aria-label="truck"
            />
          </Tooltip>
          <Tooltip label="Items ordered">
            <IconButton
              onClick={onViewCartInfo}
              colorScheme="blue"
              icon={<Icon as={FaShoppingCart} />}
              aria-label="shopping cart"
            />
          </Tooltip>
          <Tooltip label="Customer info">
            <IconButton
              onClick={onViewUserInfo}
              colorScheme="brand"
              icon={<Icon as={FaUser} />}
              aria-label="user"
            />
          </Tooltip>
        </HStack>
      </Td>
    </Tr>
  );
};
