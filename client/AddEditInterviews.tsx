import React, { useEffect, useState } from "react";
import { Box, Button, Center, Flex, FormControl, FormErrorMessage, FormLabel, Heading, HStack, IconButton, Input, Select, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Stack, Table, Tbody, Td, Text, Th, Thead, Tr, useToast, VStack } from "@chakra-ui/react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import { useParams } from "react-router-dom";


interface IFormInputs {
  jobTitle: string;
  dateAndTime: string;
  interviewerEmail: string;   
  candidate: {
    name: string;
    email: string;
    phone: number;
    // resume: File;
  };
  associateTags: {
    tagName: string;
    beginner: number;
    intermediate: number;
    advanced: number;
  }[];
}

// interface IErrorData {
//     field: "jobTitle" | "dateAndTime" | "interviewerEmail" | "password" | `root.${string}` | "root";
//     message: string;
// }

const schema = yup.object().shape({
    jobTitle: yup.string().required('Job Title is required'),
    dateAndTime:  yup.string().required('Date and Time are required').typeError('Invalid date or time'),
    interviewerEmail: yup.string().email('Invalid email').required('Interviewer email is required'),
    candidate: yup.object().shape({
        name: yup.string().required('Candidate name is required'),
        email: yup.string().email('Invalid email').required('Candidate email is required'),
        phone: yup.string()
        .required('Phone number is required')
        .matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits'),
        // resume: yup.mixed().required('Resume is required')
      }),
      associateTags: yup
      .array()
      .of(
        yup.object().shape({
          tagName: yup.string().required('Tag Name is required'),
          beginner: yup
            .number()
            .min(0, 'Beginner value cannot be less than 0')
            .max(5, 'Beginner value cannot be more than 5')
            .required('Beginner value is required'),
          intermediate: yup
            .number()
            .min(0, 'Intermediate value cannot be less than 0')
            .max(5, 'Intermediate value cannot be more than 5')
            .required('Intermediate value is required'),
          advanced: yup
            .number()
            .min(0, 'Adavanced value cannot be less than 0')
            .max(5, 'Adavanced value cannot be more than 5')
            .required('Adavanced value is required'),
        })),
});

const interviewerOptions = [
    { value: 'John@gmail.com', label: 'John@gmail.com' },
    { value: 'Rick@gmail.com', label: 'Rick@gmail.com' },
    { value: 'Jonus@gmail.com', label: 'Jonus@gmail.com' },
  ];
const tagOptions = [
    { value: 'HTML', label: 'HTML' },
    { value: 'CSS', label: 'CSS' },
    { value: 'Javscript', label: 'Javscript' },
  ];

const AddEditInterviews: React.FC = ():JSX.Element => {
    const params = useParams();
    const isAddMode = !params.id;
    console.log("params ==>", params);
    const toast = useToast();
    const [interview, setInterview] = useState({});
    const {
        control,
        handleSubmit,
        register,
        formState,
        setError,
        setValue
      } = useForm<IFormInputs>({
        defaultValues: {
            jobTitle: '',
            dateAndTime: '',
            interviewerEmail: '', // Default value for item selection
            candidate: {
                name: '',
                email: '',
                phone: 0,
            },
            associateTags: [{ tagName: '', beginner: 0, intermediate: 0, advanced: 0 }],
        },
        resolver: yupResolver(schema) as any,
      });
    const { errors, isSubmitting  } = formState;
    // UseFieldArray for managing dynamic tag rows
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'associateTags',
    });

    async function fetchInterviewToUpdate() {
        try {
            const response = await fetch(`http://localhost:1337/interviews/get/${params.id}`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                },
              });
            const res = await response.json();
            setInterview(res.data);
        }
        catch(e) {

        }       
    }
    useEffect(() => {
        if (!isAddMode) {
            fetchInterviewToUpdate();
            // get user and set form fields
            // userService.getById(id).then(user => {
            //     const fields = ['title', 'firstName', 'lastName', 'email', 'role'];
            //     fields.forEach(field => setValue(field, user[field]));
            //     setUser(user);
            // });
        }
    }, []);
    
    async function createInterview(data: IFormInputs) {
        try {
            // Make a POST request to your API endpoint for validation
            const response = await fetch('http://localhost:1337/interviews/create', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(data),
            });
            alert(response);
  
            if (!response.ok) {
              const errorData = await response.json();
              if (errorData.errors.length) {
                errorData.errors.forEach((err: any) => {
                  setError(err.field, { type: 'server', message: err.message });
                });
              }
              toast({
                  title: "Validation failed",
                  description: "Please fill up manadatory fields",
                  status: "info",
                  duration: 3000,
                  isClosable: true,
              })
              return;
            }
      
            const result = await response.json();
            if(result) {
              toast({
                  title: "Interview Created",
                  description: result.message,
                  status: "success",
                  duration: 3000,
                  isClosable: true,
              })
            }
  
          } catch (error) {
              toast({
                  title: "API error",
                  description: "API failed with some error",
                  status: "error",
                  duration: 3000,
                  isClosable: true,
              })
          }
    }

    async function updateInterview(data: IFormInputs, id: number | string | undefined) {
        try {
            // Make a POST request to your API endpoint for validation
            const response = await fetch(`http://localhost:1337/interviews/update/${id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(data),
            });
            alert(response);
  
            if (!response.ok) {
              const errorData = await response.json();
              if (errorData.errors.length) {
                errorData.errors.forEach((err: any) => {
                  setError(err.field, { type: 'server', message: err.message });
                });
              }
              toast({
                  title: "Validation failed",
                  description: "Please fill up manadatory fields",
                  status: "info",
                  duration: 3000,
                  isClosable: true,
              })
              return;
            }
      
            const result = await response.json();
            if(result) {
              toast({
                  title: "Interview Updated",
                  description: result.message,
                  status: "success",
                  duration: 3000,
                  isClosable: true,
              })
            }
  
          } catch (error) {
              toast({
                  title: "API error",
                  description: "API failed with some error",
                  status: "error",
                  duration: 3000,
                  isClosable: true,
              })
          }
    }
    const onSubmit: SubmitHandler<IFormInputs> = async (data) => {
        return isAddMode ? createInterview(data) : updateInterview(data, params.id);
    }

    return (
        <Box p={4}>
            <Heading as='h6' size='sm'>Schedule Interview</Heading>
            <Box>
            <Box maxW="lg" mt={4}>
                <Stack
                    as="form"
                    onSubmit={handleSubmit(onSubmit)}
                    spacing={4}
                    w="100%"
                >
                    <FormControl isInvalid={!!errors.jobTitle}>
                        <FormLabel htmlFor='jobTitle'>Job Title*</FormLabel>
                        <Input
                            id='jobTitle'
                            type='string'
                            placeholder='First Name'
                            value={interview.jobTitle}
                            {...register('jobTitle')}
                        />
                        <FormErrorMessage>
                            {errors.jobTitle && errors.jobTitle.message}
                        </FormErrorMessage>
                    </FormControl>
                    <Box textAlign={"left"}>
                        <HStack spacing={2} >
                            <FormControl isInvalid={!!errors.dateAndTime}>
                                <FormLabel htmlFor='dateAndTime'>Date and Time*</FormLabel>
                                <Input
                                    id='dateAndTime'
                                    type='datetime-local'
                                    placeholder='Select date and time'
                                    {...register('dateAndTime')}
                                />
                                <FormErrorMessage>
                                    {errors.dateAndTime && errors.dateAndTime.message}
                                </FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={!!errors.interviewerEmail}>
                                <FormLabel htmlFor='interviewerEmail'>
                                    Interviewer *
                                </FormLabel>
                                <Select
                                    placeholder="Select interviewer"
                                    {...register('interviewerEmail')}
                                >
                                    {interviewerOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                    ))}
                                </Select>
                                <FormErrorMessage>
                                    {errors.interviewerEmail && errors.interviewerEmail.message}
                                </FormErrorMessage>
                            </FormControl>
                        </HStack>
                    </Box>
                    <Text size={'md'}>Candidate Info*</Text>
                    <HStack>
                        {/* Candidate Info */}
                        <FormControl isInvalid={!!errors.candidate?.name}>
                            <FormLabel>Name</FormLabel>
                            <Input {...register('candidate.name')} placeholder="Enter candidate name" />
                            {errors.candidate?.name && <Text color="red.500">{errors.candidate.name.message}</Text>}
                        </FormControl>
                        <FormControl isInvalid={!!errors.candidate?.email}>
                            <FormLabel>Email</FormLabel>
                            <Input type="email" {...register('candidate.email')} placeholder="Enter candidate email" />
                            {errors.candidate?.email && <Text color="red.500">{errors.candidate.email.message}</Text>}
                        </FormControl>
                        <FormControl isInvalid={!!errors.candidate?.phone}>
                            <FormLabel>Phone</FormLabel>
                            <Input type="string" {...register('candidate.phone')} placeholder="Enter candidate phone" />
                            {errors.candidate?.phone && <Text color="red.500">{errors.candidate.phone.message}</Text>}
                        </FormControl>
                    </HStack>

                    <Text size={'md'}>Associate Tags*</Text>
                    <Flex justifyContent={"left"}>
                        {/* Add new tag row button */}
                        <Button
                            onClick={() => append({ tagName: '', beginner: 0, intermediate: 0, advanced: 0 })} // Append a new row
                            leftIcon={<AddIcon />}
                            colorScheme="green"
                            variant="solid"
                            minWidth={'5rem'}
                        >
                            Add Tag
                        </Button>
                    </Flex>
                    
                    <Table variant="simple" size="lg">
                        <Thead>
                        <Tr>
                            <Th>Tag Name</Th>
                            <Th>Beginner</Th>
                            <Th>Intermediate</Th>
                            <Th>Advanced</Th>
                            <Th>Actions</Th>
                        </Tr>
                        </Thead>

                        {/* Table Body with dynamic rows */}
                        <Tbody>
                        {fields.map((field, index) => (
                            <Tr key={field.id}>
                            {/* Tag Name Dropdown */}
                            <Td minWidth={'250px'}>
                                <FormControl isInvalid={!!errors?.associateTags?.[index]?.tagName}>
                                <Select
                                    placeholder="Select Tag"
                                    {...register(`associateTags.${index}.tagName`)}
                                    onChange={(e) => setValue(`associateTags.${index}.tagName`, e.target.value)}
                                >
                                    {tagOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </Select>
                                {errors?.associateTags?.[index]?.tagName && (
                                    <FormErrorMessage>
                                        {errors.associateTags[index]?.tagName?.message}
                                    </FormErrorMessage>
                                )}
                                </FormControl>
                            </Td>

                            {/* Beginner Slider */}
                            <Td>
                                <FormControl isInvalid={!!errors?.associateTags?.[index]?.beginner}>
                                <Slider
                                    defaultValue={field.beginner}
                                    min={0}
                                    max={5}
                                    step={1}
                                    onChange={(val) => setValue(`associateTags.${index}.beginner`, val)}
                                >
                                    <SliderTrack>
                                    <SliderFilledTrack />
                                    </SliderTrack>
                                    <SliderThumb boxSize={6} />
                                </Slider>
                                {errors?.associateTags?.[index]?.beginner && (
                                    <FormErrorMessage>
                                    {errors.associateTags[index]?.beginner?.message}
                                    </FormErrorMessage>
                                )}
                                </FormControl>
                            </Td>

                            {/* Intermediate Slider */}
                            <Td>
                                <FormControl isInvalid={!!errors?.associateTags?.[index]?.intermediate}>
                                <Slider
                                    defaultValue={field.intermediate}
                                    min={0}
                                    max={5}
                                    step={1}
                                    onChange={(val) => setValue(`associateTags.${index}.intermediate`, val)}
                                >
                                    <SliderTrack>
                                    <SliderFilledTrack />
                                    </SliderTrack>
                                    <SliderThumb boxSize={6} />
                                </Slider>
                                {errors?.associateTags?.[index]?.intermediate && (
                                    <FormErrorMessage>
                                    {errors.associateTags[index]?.intermediate?.message}
                                    </FormErrorMessage>
                                )}
                                </FormControl>
                            </Td>

                            {/* Advanced Slider */}
                            <Td>
                                <FormControl isInvalid={!!errors?.associateTags?.[index]?.advanced}>
                                <Slider
                                    defaultValue={field.advanced}
                                    min={0}
                                    max={5}
                                    step={1}
                                    onChange={(val) => setValue(`associateTags.${index}.advanced`, val)}
                                >
                                    <SliderTrack>
                                    <SliderFilledTrack />
                                    </SliderTrack>
                                    <SliderThumb boxSize={6} />
                                </Slider>
                                {errors?.associateTags?.[index]?.advanced && (
                                    <FormErrorMessage>
                                    {errors.associateTags[index]?.advanced?.message}
                                    </FormErrorMessage>
                                )}
                                </FormControl>
                            </Td>

                            {/* Remove Button */}
                            <Td>
                                <IconButton
                                    aria-label="Remove Tag"
                                    icon={<DeleteIcon />}
                                    colorScheme="red"
                                    onClick={() => remove(index)} // Remove row
                                />
                            </Td>
                            </Tr>
                        ))}
                        </Tbody>
                    </Table>

                    {/* Global Errors */}
                    {errors.associateTags && typeof errors.associateTags === 'string' && (
                        <Text color="red.500">{errors.associateTags}</Text>
                    )}
                    <Center>
                        <Button mt={4} colorScheme='teal' isLoading={isSubmitting} type='submit'>
                            Submit
                        </Button>
                        <Button mt={4} colorScheme='teal' isLoading={isSubmitting} type='submit'>Update</Button>
                    </Center>
                </Stack>
            </Box>
            </Box>
        </Box>
    )
}

export default AddEditInterviews;