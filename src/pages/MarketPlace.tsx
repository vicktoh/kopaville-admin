import React, { FC, useEffect, useState } from 'react';
import {
    Button,
    Flex,
    Heading,
    HStack,
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
} from '@chakra-ui/react';
import {
    collection,
    getDocs,
    limit,
    onSnapshot,
    query,
} from 'firebase/firestore';
import { useDispatch } from 'react-redux';
import { ProductStats } from '../components/ProductStats';
import { setCategories } from '../reducers/categoriesSlice';
import { useAppSelector } from '../reducers/types';
import { db } from '../services/firebase';
import { Product } from '../types/Product';
import { ProductForm } from '../components/ProductForm';

export const MarketPlace: FC = () => {
    const { categories } = useAppSelector(({ categories }) => ({ categories }));
    const dispatch = useDispatch();
    const [products, setProducts] = useState<Product[]>();
    const [loadingProducts, setLoadingProducts] = useState<boolean>(false);
    const [page, setpage] = useState<number>(1);
    const {
        isOpen: isProductModalOpen,
        onClose: onCloseProductModal,
        onOpen: onOpenProductModal,
    } = useDisclosure();

    useEffect(() => {
        async function fetchCategories() {
            const collectionRef = collection(db, 'categories');
            const snapshot = await getDocs(collectionRef);
            const cats: string[] = [];
            snapshot.forEach((snap) => {
                const data: any = snap.data();
                cats.push(data?.title || '');
            });
            dispatch(setCategories(cats));
        }

        if (!categories) {
            fetchCategories();
        }
    }, [categories, dispatch]);

    useEffect(() => {
        async function fetchProducts() {
            const collectionRef = collection(db, 'products');
            const q = query(collectionRef, limit(1000));
            try {
                setLoadingProducts(true);
                const listener = onSnapshot(q, (snapshot) => {
                    const prods: Product[] = [];
                    snapshot.forEach((snap) => {
                        const data = snap.data() as Product;
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
                    onClick={onOpenProductModal}
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
                                <Tr>
                                    <Td>{product.name}</Td>
                                    <Td>{product.vendorName}</Td>
                                    <Td>{product.category}</Td>
                                    <Td>{product.price}</Td>
                                    <Td>
                                        <HStack spacing={2}>
                                            <Button
                                                size="xs"
                                                colorScheme="brand"
                                                variant="outline"
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                size="xs"
                                                colorScheme="red"
                                                variant="solid"
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
                                    No Products Yet
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
                    <ModalHeader>Product</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody px={5}>
                        <ProductForm onCloseForm={onCloseProductModal} />
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Flex>
    );
};
