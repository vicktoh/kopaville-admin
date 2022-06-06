import React, { FC, useEffect, useState } from "react";
import {
  Button,
  Flex,
  Heading,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { collection, limit, onSnapshot, query } from "firebase/firestore";
import { ProductStats } from "../components/ProductStats";
import { db } from "../services/firebase";
import { Product } from "../types/Product";
import { ProductForm } from "../components/ProductForm";
import { deleteProduct } from "../services/productsServices";
import { useAppSelector } from "../reducers/types";
import { StateComponent } from "../components/StateComponent";

export const MarketPlace: FC = () => {
  const categories = useAppSelector(({ categories }) => categories);
  const [products, setProducts] = useState<Product[]>();
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [loadingProducts, setLoadingProducts] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  // const [page, setpage] = useState<number>(1);
  const toast = useToast();
  const {
    isOpen: isProductModalOpen,
    onClose: onCloseProductModal,
    onOpen: onOpenProductModal,
  } = useDisclosure();
  const {
    isOpen: isDeleteModalOpen,
    onClose: onCloseDeleteModal,
    onOpen: onOpenDeleteModal,
  } = useDisclosure();
  const [selectedProduct, setSelectedProduct] = useState<Product>();

  useEffect(() => {
    async function fetchProducts() {
      const collectionRef = collection(db, "products");
      const q = query(collectionRef, limit(1000));
      try {
        setLoadingProducts(true);
        const listener = onSnapshot(q, (snapshot) => {
          const prods: Product[] = [];
          snapshot.forEach((snap) => {
            const data = snap.data() as Product;
            data.productId = snap.id;
            prods.push(data);
          });

          setProducts(prods);
        });
        return () => listener();
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingProducts(false);
      }
    }
    fetchProducts();
  }, []);

  const deletePrompt = (id: number) => {
    if (!products) return;
    setSelectedProduct(products[id]);
    onOpenDeleteModal();
  };

  const onDeleteProduct = async () => {
    if (!selectedProduct) return;
    try {
      setDeleting(true);
      await deleteProduct(selectedProduct);
    } catch (error) {
      const err: any = error;
      toast({
        title: "Could not delete",
        description: err?.message || "Unknown delete",
        status: "error",
      });
    } finally {
      setDeleting(false);
      onCloseDeleteModal();
    }
  };

  const editProduct = (i: number) => {
    if (!products) return;
    setSelectedProduct(products[i]);
    setMode("edit");
    onOpenProductModal();
  };
  const addNewProduct = () => {
    setSelectedProduct(undefined);
    setMode("add");
    onOpenProductModal();
  };

  if (loadingProducts) {
    return <StateComponent loading={true} loadingText="Fetching Products" />;
  }
  return (
    <Flex direction="column" position="relative" px={5} pt={10}>
      <ProductStats />
      <Flex
        direction="row"
        justifyContent="space-between"
        mt={8}
        py={5}
        alignItems="center"
      >
        <Heading fontSize="md">Product List</Heading>
        <Button
          onClick={addNewProduct}
          size="sm"
          variant="solid"
          colorScheme="brand"
        >
          Add New Product
        </Button>
      </Flex>

      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th>Product Name</Th>
              <Th>Vendor Name</Th>
              <Th>Category</Th>
              <Th>Price</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {products && products.length ? (
              products.map((product, index) => (
                <Tr key={`product-${index}`}>
                  <Td>{product.name}</Td>
                  <Td>{product.vendorName}</Td>
                  <Td>{categories?.map[product.category]}</Td>
                  <Td>{product.price}</Td>
                  <Td>
                    <HStack spacing={2}>
                      <Button
                        size="xs"
                        borderColor="brand.500"
                        color="brand.500"
                        variant="outline"
                        onClick={() => editProduct(index)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="xs"
                        colorScheme="red"
                        variant="solid"
                        onClick={() => deletePrompt(index)}
                      >
                        Delete
                      </Button>
                    </HStack>
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={5} textAlign="center">
                  No Categories Yet
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </TableContainer>
      <Modal
        isOpen={isProductModalOpen}
        onClose={onCloseProductModal}
        size="lg"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{`${mode} product`}</ModalHeader>
          <ModalCloseButton />
          <ModalBody px={5}>
            <ProductForm
              mode={mode}
              onCloseForm={onCloseProductModal}
              product={selectedProduct}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal isOpen={isDeleteModalOpen} onClose={onCloseDeleteModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Product</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Are you sure you want to delete this product</Text>
          </ModalBody>
          <ModalFooter>
            <HStack spacing={4}>
              <Button variant="outline">Cancel</Button>

              <Button
                isLoading={deleting}
                onClick={() => onDeleteProduct()}
                variant="solid"
                colorScheme="red"
              >
                Yes
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};
