import React, { ChangeEvent, FC, useState } from "react";
import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Icon,
  IconButton,
  Image,
  Input,
  Select,
  SimpleGrid,
  Text,
  Textarea,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { Product, ProductFormValue, ProductGrade } from "../types/Product";
import { Form, Formik, useFormikContext } from "formik";
import { useAppSelector } from "../reducers/types";
import { addProduct, editProduct } from "../services/productsServices";
import { BsPlus } from "react-icons/bs";
import { FaMinusCircle } from "react-icons/fa";

type ProductFormProps = {
  onCloseForm: () => void;
  mode: "add" | "edit";
  product?: Product;
};

const ProductVariant: FC = () => {
  const { values, handleChange, handleBlur, setFieldValue } =
    useFormikContext<ProductFormValue>();
  const variants = Object.keys(values.variants || {});
  const [newVariant, setNewVariant] = useState<{ text: string; error: string }>(
    { text: "", error: "" }
  );
  console.log(values.variants);
  const addProductVariants = () => {
    if (!newVariant.text.trim()) return;
    if ((values.variants || {})[newVariant.text]) {
      setNewVariant({ ...newVariant, error: "Variant already exist" });
      return;
    }
    setFieldValue("variants", {
      ...(values.variants || {}),
      [newVariant.text]: [],
    });
    setNewVariant({ text: "", error: "" });
  };

  const addNewOption = (variant: string) => {
    if (!values.variants) return;
    const variantOption = (values.variants || {})[variant];
    if (variantOption) {
      setFieldValue("variants", {
        ...values.variants,
        [variant]: [...values.variants[variant], { text: "" }],
      });
    }
  };
  const removeOption = (variant: string, i: number) => {
    if (!values.variants || !values.variants[variant]) return;

    const options = [...values.variants[variant]];
    options.splice(i, 1);
    setFieldValue("variants", { ...values.variants, [variant]: options });
  };

  const removeVariant = (variant: string) => {
    if (!variant || !values.variants || !values.variants[variant]) return;
    const newVariants = { ...values.variants };
    delete newVariants[variant];
    setFieldValue("variants", newVariants);
  };

  return (
    <Flex direction="column" mt={8}>
      <Heading fontSize="sm">Product Variants</Heading>
      <SimpleGrid columns={2} gap={3} my={3}>
        <Input
          value={newVariant.text}
          onChange={(e) =>
            setNewVariant({ ...newVariant, text: e.target.value })
          }
          placeholder="New variant"
          variant="outline"
          size="sm"
        />
        <Button
          alignSelf="flex-start"
          onClick={addProductVariants}
          variant="solid"
          size="sm"
        >
          Add
        </Button>
      </SimpleGrid>
      <Flex direction="column" mt={2}>
        {variants.length
          ? variants.map((variantName) => (
              <Flex
                mb={5}
                direction="column"
                key={`product-variant-${variantName}`}
              >
                <HStack spacing={3} mb={3} alignItems="center">
                  <Heading fontSize="sm">{variantName}</Heading>
                  <Tooltip label="Add variant option eg. xl, lg, or red, blue, e.t.c">
                    <IconButton
                      rounded="full"
                      icon={<Icon size={5} as={BsPlus} />}
                      aria-label="Add Option"
                      onClick={() => addNewOption(variantName)}
                    />
                  </Tooltip>
                  <Tooltip label="Add variant option eg. xl, lg, or red, blue, e.t.c">
                    <IconButton
                      icon={<Icon as={FaMinusCircle} />}
                      aria-label="Remove variant"
                      onClick={() => removeVariant(variantName)}
                    />
                  </Tooltip>
                </HStack>
                <Flex direction="column" px={5} alignItems="flex-start">
                  {values.variants && values.variants[variantName]?.length
                    ? values.variants[variantName].map((variantOption, i) => (
                        <HStack
                          key={`variant-${variantName}-${variantOption}`}
                          spacing={2}
                          mt={4}
                        >
                          <Input
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={variantOption.text}
                            name={`variants.${variantName}.${i}.text`}
                            size="xs"
                            variant="outline"
                          />
                          <IconButton
                            onClick={() => removeOption(variantName, i)}
                            aria-label="remove option"
                            icon={<Icon as={FaMinusCircle} />}
                          />
                        </HStack>
                      ))
                    : null}
                </Flex>
              </Flex>
            ))
          : null}
      </Flex>
    </Flex>
  );
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
        grade: product.grade,
        variants: product.variants,
      }
    : {
        name: "",
        price: 0,
        category: "",
        quantity: 0,
        description: "",
        grade: ProductGrade.New,
        variants: {},
      };

  function onSelectFile(e: ChangeEvent<HTMLInputElement>) {
    if (e.target?.files?.length) {
      if (e.target.files?.length > 4) {
        toast({
          title: "File limit exceeded",
          description: "maximum of 4 files allowed",
          status: "error",
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
        <Image src={URL.createObjectURL(files[i])} width="80px" height="80px" />
      );
    }

    return images;
  }
  return (
    <Flex width="100%">
      <Formik
        initialValues={initialValues}
        onSubmit={async (values) => {
          if (files && mode === "add") {
            await addProduct(values, files);
            onCloseForm();
          }
          if (mode === "edit") {
            await editProduct(values, product?.productId || "", files);
            onCloseForm();
          }
        }}
        validate={(values) => {
          const errors: any = {};
          if (!values.category) {
            errors.category = "You must select a category for this product";
          }
          if (!values.name) {
            errors.name = "Product name cannot be empty";
          }
          if (!values.description) {
            errors.description =
              "You must select a description for this product";
          }
          if (!values.price) {
            errors.price = "You must select a description for this product";
          }

          if (!files || !files.length) {
            errors.photoUrl =
              "You must select at least one file for this product";
          }
        }}
      >
        {({
          values,
          handleBlur,
          isSubmitting,
          errors,
          touched,
          handleChange,
        }) => (
          <Form style={{ width: "100%" }}>
            <FormControl mt={3} isRequired>
              <FormLabel>Product name</FormLabel>
              <Input
                name="name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <FormErrorMessage>{touched.name && errors.name}</FormErrorMessage>
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
            <SimpleGrid gap={3} columns={[1, 2]}>
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
            </SimpleGrid>

            <SimpleGrid columns={[1, 2]} gap={3}>
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
                    ? categories.categories.map((category) => (
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
              <FormControl mt={3} isRequired>
                <FormLabel>Product Grade</FormLabel>
                <Select
                  name="grade"
                  value={values.grade}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <option value="" disabled selected>
                    Select Grade
                  </option>
                  {Object.keys(ProductGrade).map((grade) => (
                    <option key={`grade-${grade}`} value={grade}>
                      {grade}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>
                  {touched.grade && errors.grade}
                </FormErrorMessage>
              </FormControl>
            </SimpleGrid>
            <ProductVariant />
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
              <FormErrorMessage>{errors.photoUrl || ""}</FormErrorMessage>
            </FormControl>
            <HStack spacing={2} wrap="wrap">
              {files ? renderFiles() : null}
            </HStack>
            <HStack>
              {!files && mode === "edit" && product?.images.length
                ? product.images.map((imageurl, i) => (
                    <Image
                      key={`image-${i}`}
                      src={imageurl}
                      width="80px"
                      height="80px"
                    />
                  ))
                : null}
            </HStack>

            <Flex direction="row" mt={5} py={5} justifyContent="space-between">
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
