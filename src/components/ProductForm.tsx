import React, { ChangeEvent, FC, useState } from 'react';
import {
    Button,
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    HStack,
    Image,
    Input,
    Select,
    Text,
    Textarea,
    useToast,
} from '@chakra-ui/react';
import { Product, ProductFormValue } from '../types/Product';
import { Form, Formik } from 'formik';
import { useAppSelector } from '../reducers/types';
import { addProduct, editProduct } from '../services/productsServices';

type ProductFormProps = {
    onCloseForm: () => void;
    mode: 'add' | 'edit';
    product?: Product;
};
export const ProductForm: FC<ProductFormProps> = ({
    onCloseForm,
    mode,
    product,
}) => {
    const { categories } = useAppSelector(({ categories }) => ({ categories }));
    const [files, setFiles] = useState<FileList>();
    const toast = useToast();
    const initialValues: ProductFormValue = product
        ? {
              name: product.name,
              price: product.price,
              category: product.category,
              quantity: product.quantity,
              description: product.description,
          }
        : {
              name: '',
              price: 0,
              category: '',
              quantity: 0,
              description: '',
          };

    function onSelectFile(e: ChangeEvent<HTMLInputElement>) {
        if (e.target?.files?.length) {
            if (e.target.files?.length > 4) {
                toast({
                    title: 'File limit exceeded',
                    description: 'maximum of 4 files allowed',
                    status: 'error',
                });
                return;
            }
            setFiles(e.target.files);
        }
    }
    function renderFiles() {
        const images = [];
        if (!files) return;

        for (let i = 0; i < files?.length; i++) {
            images.push(
                <Image
                    src={URL.createObjectURL(files[i])}
                    width="80px"
                    height="80px"
                />
            );
        }

        return images;
    }
    return (
        <Flex width="100%">
            <Formik
                initialValues={initialValues}
                onSubmit={async (values, { setSubmitting }) => {
                    if (files && mode === 'add') {
                        await addProduct(values, files);
                        onCloseForm();
                    }
                    if (mode === 'edit') {
                        await editProduct(
                            values,
                            product?.productId || '',
                            files
                        );
                        onCloseForm();
                    }
                }}
                validate={(values) => {
                    const errors: any = {};
                    if (!values.category) {
                        errors.category =
                            'You must select a category for this product';
                    }
                    if (!values.name) {
                        errors.name = 'Product name cannot be empty';
                    }
                    if (!values.description) {
                        errors.description =
                            'You must select a description for this product';
                    }
                    if (!values.price) {
                        errors.price =
                            'You must select a description for this product';
                    }

                    if (!files || !files.length) {
                        errors.photoUrl =
                            'You must select at least one file for this product';
                    }
                }}
            >
                {({
                    values,
                    handleSubmit,
                    handleBlur,
                    isSubmitting,
                    errors,
                    touched,
                    handleChange,
                }) => (
                    <Form style={{ width: '100%' }}>
                        <FormControl mt={3} isRequired>
                            <FormLabel>Product name</FormLabel>
                            <Input
                                name="name"
                                value={values.name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                            <FormErrorMessage>
                                {touched.name && errors.name}
                            </FormErrorMessage>
                        </FormControl>
                        <FormControl mt={3} isRequired>
                            <FormLabel>Product Description</FormLabel>
                            <Textarea
                                placeholder="Describe the product"
                                name="description"
                                value={values.description}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                            <FormErrorMessage>
                                {touched.description && errors.description}
                            </FormErrorMessage>
                        </FormControl>
                        <FormControl mt={3} isRequired>
                            <FormLabel>Price</FormLabel>
                            <Input
                                name="price"
                                type="number"
                                value={values.price}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                            <FormErrorMessage>
                                {touched.price && errors.price}
                            </FormErrorMessage>
                        </FormControl>
                        <FormControl mt={3} isRequired>
                            <FormLabel>Quantity</FormLabel>
                            <Input
                                name="quantity"
                                type="number"
                                value={values.quantity}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                            <FormErrorMessage>
                                {touched.quantity && errors.quantity}
                            </FormErrorMessage>
                        </FormControl>
                        <FormControl mt={3} isRequired>
                            <FormLabel>Product Category</FormLabel>
                            <Select
                                name="category"
                                value={values.category}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            >
                                <option value="" disabled selected>
                                    Select Category
                                </option>
                                {categories && categories.categories?.length
                                    ? categories.categories.map((category, i) => (
                                          <option
                                              key={`category-${category.title}`}
                                              value={category.categoryId}
                                          >
                                              {category.title}
                                          </option>
                                      ))
                                    : null}
                            </Select>
                            <FormErrorMessage>
                                {touched.name && errors.name}
                            </FormErrorMessage>
                        </FormControl>
                        <FormControl mt={3}>
                            <FormLabel
                                border="2px dashed grey"
                                height="3rem"
                                htmlFor="file-input"
                                width="100%"
                            >
                                <Text
                                    color="gray.300"
                                    fontSize="3xl"
                                    width="100%"
                                    textAlign="center"
                                >
                                    Select file files
                                </Text>
                            </FormLabel>
                            <Input
                                accept="image/png, image/gif, image/jpeg"
                                display="none"
                                id="file-input"
                                type="file"
                                multiple
                                name="file-input"
                                onChange={onSelectFile}
                            />
                            <FormErrorMessage>
                                {errors.photoUrl || ''}
                            </FormErrorMessage>
                        </FormControl>
                        <HStack spacing={2} wrap="wrap">
                            {files ? renderFiles() : null}
                        </HStack>
                        <HStack>
                        {!files && mode === 'edit' && product?.images.length
                            ? product.images.map((imageurl, i) => (
                                  <Image
                                    key = {`image-${i}`}
                                      src={imageurl}
                                      width="80px"
                                      height="80px"
                                  />
                              ))
                            : null}
                        </HStack>
                        

                        <Flex
                            direction="row"
                            mt={5}
                            py={5}
                            justifyContent="space-between"
                        >
                            <Button
                                type="submit"
                                variant="solid"
                                colorScheme="brand"
                                isLoading={isSubmitting}
                            >
                                Save
                            </Button>
                            <Button variant="solid" onClick={onCloseForm}>
                                Cancel
                            </Button>
                        </Flex>
                    </Form>
                )}
            </Formik>
        </Flex>
    );
};
