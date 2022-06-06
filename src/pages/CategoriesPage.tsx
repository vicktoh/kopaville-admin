import React, { FC, useState } from "react";
import {
  Image,
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
  AspectRatio,
} from "@chakra-ui/react";

import { useAppSelector } from "../reducers/types";
import { deleteCategory } from "../services/productsServices";
import { Category } from "../types/Category";
import { CategoryForm } from "../components/CategoryForm";

export const CategoriesPage: FC = () => {
  const { categories } = useAppSelector(({ categories }) => ({ categories }));
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [deleting, setDeleting] = useState<boolean>(false);
  //  const [page, setpage] = useState<number>(1);
  const toast = useToast();
  const {
    isOpen: isCategoryModalOpen,
    onClose: onCloseCategoryModal,
    onOpen: onOpenCategoryModal,
  } = useDisclosure();
  const {
    isOpen: isDeleteModalOpen,
    onClose: onCloseDeleteModal,
    onOpen: onOpenDeleteModal,
  } = useDisclosure();
  const [selectedCategory, setSelectedCategory] = useState<Category>();

  const deletePrompt = (id: number) => {
    if (!categories) return;
    setSelectedCategory(categories?.categories[id]);
    onOpenDeleteModal();
  };

  const onDeleteCategory = async () => {
    if (!categories || !selectedCategory) return;
    try {
      setDeleting(true);
      deleteCategory(selectedCategory);
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
    if (!categories) return;
    setSelectedCategory(categories?.categories[i]);
    setMode("edit");
    onOpenCategoryModal();
  };

  const onAddCategory = () => {
    setSelectedCategory(undefined);
    setMode("add");
    onOpenCategoryModal();
  };
  return (
    <Flex direction="column" position="relative" px={5} pt={10}>
      <Flex
        direction="row"
        justifyContent="space-between"
        mt={8}
        py={5}
        alignItems="center"
      >
        <Heading fontSize="md">Categories</Heading>
        <Button
          onClick={onAddCategory}
          size="sm"
          variant="solid"
          colorScheme="brand"
        >
          Add Category
        </Button>
      </Flex>

      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th>Category Name</Th>
              <Th>Category Description</Th>
              <Th>Images</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {categories && categories?.categories.length ? (
              categories.categories.map((category, index) => (
                <Tr key={`categories-row-${index}`}>
                  <Td>{category.title}</Td>
                  <Td>{category.description}</Td>
                  <Td>
                    <AspectRatio ratio={4 / 3} maxW="100px">
                      <Image src={category.avartar} alt="Alt images" />
                    </AspectRatio>
                  </Td>
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
                  No Products Yet
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </TableContainer>
      <Modal
        isOpen={isCategoryModalOpen}
        onClose={onCloseCategoryModal}
        size="lg"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{`${mode} category`}</ModalHeader>
          <ModalCloseButton />
          <ModalBody px={5}>
            <CategoryForm
              mode={mode}
              onCloseForm={onCloseCategoryModal}
              category={selectedCategory}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal isOpen={isDeleteModalOpen} onClose={onCloseDeleteModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Category</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Are you sure you want to delete this category</Text>
          </ModalBody>
          <ModalFooter>
            <HStack spacing={4}>
              <Button variant="outline">Cancel</Button>

              <Button
                isLoading={deleting}
                onClick={() => onDeleteCategory()}
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
