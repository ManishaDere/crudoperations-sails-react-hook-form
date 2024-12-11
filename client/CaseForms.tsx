import { SubmitHandler, useForm } from 'react-hook-form';
import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
  Box,
  Center,
  Heading,
  useToast,
  VStack
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

interface IFormInputs {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
};

interface IErrorData {
    field: "firstName" | "lastName" | "email" | "password" | `root.${string}` | "root";
    message: string;
}

const schema = yup.object().shape({
    firstName: yup.string().required('First Name is required'),
    lastName: yup.string().required('Last Name is required'),
    email: yup
      .string()
      .email('Invalid email address')
      .required('Email is required'),
    password: yup
      .string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required'),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password')], 'Passwords must match')
      .required('Confirm Password is required'),
});

const CaseForms = () => {
    const toast = useToast();
    const {
        handleSubmit,
        register,
        formState,
        setError
      } = useForm<IFormInputs>({
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
        resolver: yupResolver(schema),
      });
    const { errors, isSubmitting  } = formState;

    const onSubmit: SubmitHandler<IFormInputs> = async (data) => {
        try {
          // Make a POST request to your API endpoint for validation
          const response = await fetch('http://localhost:1337/customer/createUser', {
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
              errorData.errors.forEach((err: IErrorData) => {
                setError(err.field, { type: 'server', message: err.message });
              });
            }
            toast({
                title: "Registration failed",
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
                title: "Registered",
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
      };

      return (
        <>
            <Center>
                <Heading as="h2" size={'l'}>
                    Registration form
                </Heading>
            </Center>
            <Box
                w={['90%', '80%', '60%', '50%']} // Responsive width for mobile, tablet, and desktop
                mx="auto" // Center the form horizontally
                p={[4, 6, 8]} // Responsive padding
                mt={[4, 2]} // Responsive margin-top
                borderWidth="1px"
                borderRadius="lg"
                boxShadow="lg"
            >
                <VStack
                    as="form"
                    onSubmit={handleSubmit(onSubmit)}
                    spacing={4}
                    w="100%"
                >
                    <FormControl isInvalid={!!errors.firstName}>
                        <FormLabel htmlFor='firstName'>First name*</FormLabel>
                        <Input
                            id='firstName'
                            type='string'
                            placeholder='First Name'
                            {...register('firstName')}
                        />
                        <FormErrorMessage>
                            {errors.firstName && errors.firstName.message}
                        </FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.lastName}>
                        <FormLabel htmlFor='lastName'>Last name*</FormLabel>
                        <Input
                            id='lastName'
                            type='string'
                            placeholder='Last Name'
                            {...register('lastName')}
                        />
                        <FormErrorMessage>
                            {errors.lastName && errors.lastName.message}
                        </FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.email}>
                        <FormLabel htmlFor='email'>
                            Email *
                        </FormLabel>
                        <Input 
                            id="email"
                            placeholder='Please Enter Email'
                            {...register('email')}
                        />
                        <FormErrorMessage>
                            {errors.email && errors.email.message}
                        </FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.password}>
                        <FormLabel htmlFor='password'>Password*</FormLabel>
                        <Input
                            id='password'
                            type='password'
                            placeholder='Enter Password'
                            {...register('password')}
                        />
                        <FormErrorMessage>
                            {errors.password && errors.password.message}
                        </FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.confirmPassword}>
                        <FormLabel htmlFor='confirmPassword'>Confirm Password*</FormLabel>
                        <Input
                            id='confirmPassword'
                            type='password'
                            placeholder='Enter confirm Password'
                            {...register('confirmPassword')}
                        />
                        <FormErrorMessage>
                            {errors.confirmPassword && errors.confirmPassword.message}
                        </FormErrorMessage>
                    </FormControl>
                    <Center>
                        <Button mt={4} colorScheme='teal' isLoading={isSubmitting} type='submit'>
                            Submit
                        </Button>
                    </Center>
                </VStack>
            </Box>
        </>
    )
}

export default CaseForms;