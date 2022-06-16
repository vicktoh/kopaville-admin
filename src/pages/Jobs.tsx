import React, { FC, useState } from "react";
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
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { BsSearch } from "react-icons/bs";
import { StateComponent } from "../components/StateComponent";
import { useSearchIndex } from "../hooks/useSearchIndex";
import { JobCard } from "../components/JobCard";
import { JobType } from "../types/Jobs";
import { deleteJob, verifyJob } from "../services/jobServices";

export const Jobs: FC = () => {
  const [isDeleting, setDeleting] = useState<boolean>(false);
  const [searchField, setSearchField] = useState<string>("");
  const [selectedJobIndex, setSelectedIndex] = useState<number>();
  const [selectedJob, setSelectedJob] = useState<JobType>();
  const {
    isOpen: isDeleteModalOpen,
    onClose: onCloseDeleteModal,
    onOpen: openDeleteModal,
  } = useDisclosure();

  const {
    data: jobs,
    loading,
    setData,
    setQuery,
  } = useSearchIndex<JobType[]>("jobs");
  const toast = useToast();

  const onEnterQuery = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.keyCode === 13) {
      setQuery(searchField);
    }
  };
  const onDeletePrompt = (index: number, job: JobType) => {
    setSelectedIndex(index);
    setSelectedJob(job);
    openDeleteModal();
  };
  const removeJob = async () => {
    if (!jobs || selectedJobIndex === undefined || !selectedJob) return;
    try {
      setDeleting(true);
      await deleteJob(selectedJob.objectID || "");
      const newjobs = [...jobs];
      newjobs.splice(selectedJobIndex, 1);
      setData(newjobs);
      toast({
        title: "Listing has been successfully removed",
        status: "success",
      });
    } catch (error) {
      console.log(error);
      const err: any = error;
      toast({
        title: "Could not delete post",
        description: err?.message || "Could not remove post",
        status: "error",
      });
    } finally {
      setDeleting(false);
      onCloseDeleteModal();
    }
  };
  const verify = async (job: JobType, i: number) => {
    if (!jobs) return;
    try {
      await verifyJob(job?.objectID || "", !!!job.verified);
      const newjobs = [...jobs];
      newjobs[i].verified = !!!job.verified;
      setData(newjobs);
    } catch (error) {
      const err: any = error;
      toast({
        title: "Unable to be verified",
        description: err?.message || "Unknown error",
        status: "error",
      });
    }
  };

  if (loading) {
    return <StateComponent loading={true} loadingText="fetching jobs" />;
  }
  return (
    <Flex
      direction="column"
      position="relative"
      width="100%"
      height="100vh"
      overflow="scroll"
    >
      {/* Header */}
      <Flex
        width="100%"
        position="sticky"
        top={0}
        bg="secondary.300"
        py={5}
        px={3}
        zIndex={5}
      >
        <Heading fontSize="md">Job Moderation</Heading>
      </Flex>
      <Heading fontSize="sm">Search Jobs</Heading>
      <HStack spacing={1} px={3} py={5}>
        <Icon as={BsSearch} fontSize="lg" />
        <Input
          onKeyUp={onEnterQuery}
          size="md"
          placeholder="search jobs, by user, content, etc"
          onChange={(e) => setSearchField(e.target.value)}
          value={searchField}
          variant="outline"
        />
      </HStack>
      {/* Main content */}
      <Flex px={20} pl={10} direction="column">
        {jobs?.length ? (
          jobs.map((job, i) => (
            <JobCard
              onDelete={() => onDeletePrompt(i, job)}
              job={job}
              key={`job-component-${i}`}
              verify={() => verify(job, i)}
            />
          ))
        ) : (
          <StateComponent description="There are no jobs" />
        )}
      </Flex>
      {/* Delete Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={onCloseDeleteModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>Remove Post ?</ModalHeader>
          <ModalBody>
            <Text py={10}>
              Are you sure you want to remove this Job listing?
            </Text>
            <HStack spacing={10} alignItems="center" mt={3}>
              <Button
                colorScheme="red"
                onClick={removeJob}
                isLoading={isDeleting}
              >
                Yes
              </Button>
              <Button
                colorScheme="blue"
                variant="outline"
                onClick={onCloseDeleteModal}
                disabled={isDeleting}
              >
                No
              </Button>
            </HStack>
          </ModalBody>
        </ModalContent>
      </Modal>
      {/* Enddelete modal */}
    </Flex>
  );
};
