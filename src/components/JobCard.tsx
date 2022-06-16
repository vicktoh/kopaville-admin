import {
  Flex,
  Heading,
  HStack,
  Icon,
  IconButton,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import React, { FC, useState } from "react";
import { BsCheck2All, BsEye, BsTrash } from "react-icons/bs";
import { MdCancel } from "react-icons/md";
import { JobType } from "../types/Jobs";

type JobCardType = {
  job: JobType;
  onDelete: () => void;
  verify: () => Promise<void>;
};
export const JobCard: FC<JobCardType> = ({ job, onDelete, verify }) => {
  const [verifying, setVerifying] = useState<boolean>(false);
  const verifyJob = async () => {
    setVerifying(true);
    await verify();
    setVerifying(false);
  };
  return (
    <Flex
      direction="column"
      p={5}
      borderRadius="lg"
      borderBottomWidth={1}
      borderBottomColor="primary.300"
    >
      <Heading my={3} fontSize="xl">
        {job.title || job.name}
      </Heading>
      <Text>{job.description}</Text>
      <HStack spacing={3} mt={5}>
        <Tooltip
          label={`${!!job?.verified ? "unverify" : "verify"} ${
            job?.name ? "Business" : "Job"
          }`}
        >
          <IconButton
            colorScheme="green"
            isLoading={verifying}
            onClick={verifyJob}
            icon={<Icon as={!!job?.verified ? MdCancel : BsCheck2All} />}
            aria-label="verify job"
          />
        </Tooltip>
        <Tooltip label={`remove ${job?.name ? "Business" : "Job"} `}>
          <IconButton
            colorScheme="blue"
            icon={<Icon as={BsEye} />}
            aria-label="delete"
            onClick={onDelete}
          />
        </Tooltip>
        <Tooltip label={`remove ${job?.name ? "Business" : "Job"} `}>
          <IconButton
            colorScheme="red"
            icon={<Icon as={BsTrash} />}
            aria-label="delete"
            onClick={onDelete}
          />
        </Tooltip>
      </HStack>
    </Flex>
  );
};
