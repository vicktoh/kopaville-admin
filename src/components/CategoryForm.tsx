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
    Text,
    Textarea,
    useToast,
} from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { addCategory, editCategory } from '../services/productsServices';
import { Category } from '../types/Category';

type ProductFormProps = {
    onCloseForm: () => void;
    mode: 'add' | 'edit';
    category?: Category;
};
export const CategoryForm: FC<ProductFormProps> = ({
    onCloseForm,
    mode,
    category,
}) => {
    const [file, setFile] = useState<File>();
    const toast = useToast();
    const initialValues: Category = category
        ? {
              title: category.title,
              description: category.description,
              avartar: category.avartar,
              categoryId: category.categoryId,
          }
        : {
              title: '',
              description: '',
              avartar: '',
              categoryId: '',
          };

    function onSelectFile(e: ChangeEvent<HTMLInputElement>) {
        if (e.target?.files?.length) {
            setFile(e.target.files[0]);
        }
    }

    return (
        <Flex width="100%">
            <Formik
                initialValues={initialValues}
                onSubmit={async (values) => {
                    try {
                        if (file && mode === 'add') {
                            await addCategory(values, file);
                        }
                        if (mode === 'edit') {
                            await editCategory(values, file);
                        }
                    } catch (error) {
                        const err: any = error;
                        toast({
                            title: `failed to ${mode} category`,
                            description: err?.message || 'unexpected error',
                            status: 'error',
                        });
                    } finally {
                        onCloseForm();
                    }
                }}
                validate={(values) => {
                    const errors: any = {};
                    if (!values?.title) {
                        errors.title = 'Category title is required';
                    }
                    if (!values.description) {
                        errors.description =
                            'Description for category is required';
                    }

                    if (!file && !values.avartar) {
                        errors.avartar = 'An avartar is required';
                    }

                    return errors;
                }}
            >
                {({
                    values,
                    handleBlur,
                    isSubmitting,
                    handleSubmit,
                    errors,
                    touched,
                    handleChange,
                }) => (
                    <Form style={{ width: '100%' }}>
                        <FormControl
                            mt={3}
                            isRequired
                            isInvalid={!!touched.title && !!errors.title}
                        >
                            <FormLabel>Category Title</FormLabel>
                            <Input
                                name="title"
                                value={values.title}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                            <FormErrorMessage>
                                {touched.title && errors.title}
                            </FormErrorMessage>
                        </FormControl>
                        <FormControl mt={3} isRequired>
                            <FormLabel>Category Description</FormLabel>
                            <Textarea
                                placeholder="Describe the category"
                                name="description"
                                value={values.description}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                            <FormErrorMessage>
                                {touched.description && errors.description}
                            </FormErrorMessage>
                        </FormControl>

                        <FormControl mt={3} isInvalid={!!errors.avartar}>
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
                                    Select Avartar
                                </Text>
                            </FormLabel>
                            <Input
                                accept="image/png, image/gif, image/jpeg"
                                display="none"
                                id="file-input"
                                type="file"
                                name="file-input"
                                onChange={onSelectFile}
                            />
                            <FormErrorMessage>
                                {errors.avartar || ''}
                            </FormErrorMessage>
                        </FormControl>

                        <HStack>
                            {file || values.avartar ? (
                                <Image
                                    src={
                                        (file && URL.createObjectURL(file)) ||
                                        values.avartar
                                    }
                                    width="80px"
                                    height="80px"
                                />
                            ) : null}
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
                                {' '}
                                Cancel
                            </Button>
                        </Flex>
                    </Form>
                )}
            </Formik>
        </Flex>
    );
};
