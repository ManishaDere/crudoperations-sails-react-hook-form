import React, { useEffect, useState } from "react";
import { Box, Button, Flex, Heading, Table, TableCaption, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";

interface Candidate {
    phone: string;
    email: string;
    name: string;
  }
  
  interface AssociateTag {
    tagName: string;
    beginner: number;
    intermediate: number;
    advanced: number;
  }
  
  interface Interview {
    createdAt: number;
    updatedAt: number;
    id: number;
    jobTitle: string;
    interviewerEmail: string;
    dateAndTime: string;
    candidate: Candidate;
    associateTags: AssociateTag[];
  }

const Interviews = () => {
    // const interviewList: IInterview[] = [];
    const [interviewList, setInterviewList] = useState<Interview[]>([]);
    const navigate = useNavigate();

    const handleAddInterviewBtnClick = () => {
        navigate("/interviews/add");
    }

    useEffect(() => {
        // Define an async function inside useEffect
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:1337/interviews/get');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
        
                const result = await response.json(); // Await JSON parsing
                console.log(result);
                setInterviewList(result); // Update state with the fetched data
            } catch (error) {
                console.error("Error fetching data:", error); // Log error for debugging
            //   setError(error.message); // Set error message in state
            } finally {
            //   setLoading(false); // Stop the loading state regardless of success or failure
            }
        }
        fetchData();
    }, []);

    const handleDelete = async (id: number) => {
        console.log(`Delete item with id: ${id}`);
        const response = await fetch(`http://localhost:1337/interviews/delete/${id}`, {
            method: 'DELETE',
        });
    
        const data = await response.json();
        console.log(data);
    };
    
    const handleUpdate = (id: number) => {
        console.log(`Update item with id: ${id}`);
        navigate(`/interviews/update/${id}`);
    };

    return (
        <Box p={4}>
            <Heading as="h4" size={'md'}>Interview List</Heading>
            <Flex justifyContent={"flex-end"} pb={'4'}>
                <Button colorScheme="blue" onClick={handleAddInterviewBtnClick}>Add interview</Button>
            </Flex>
            <TableContainer>
                <Table variant='simple'>
                    <Thead>
                        <Tr>
                            <Th>Job Description</Th>
                            <Th>Candidate</Th>
                            <Th>Interviewer</Th>
                            <Th>Status</Th>
                            <Th>Interview Date</Th>
                            <Th>Actions</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {interviewList && interviewList.map(interview =>{
                            const { id, jobTitle, interviewerEmail, dateAndTime } = interview;
                            return (
                            <Tr key={id}>
                                <Td>{jobTitle}</Td>
                                <Td>{interview.candidate.name}</Td>
                                <Td>{interviewerEmail}</Td>
                                <Td>{'pending'}</Td>
                                <Td>{dateAndTime}</Td>
                                <Td>
                                <Button colorScheme="blue" mr={2} onClick={() => handleUpdate(interview.id)}>
                                    <EditIcon />
                                </Button>
                                    {/* Delete Button */}
                                <Button colorScheme="red" onClick={() => handleDelete(interview.id)}>
                                    <DeleteIcon />
                                </Button>
                                </Td>
                            </Tr>
                        )})};
                    </Tbody>
                </Table>
            </TableContainer>
        </Box>
        
    )
};

export default Interviews;