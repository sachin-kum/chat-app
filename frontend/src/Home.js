import React, { useEffect } from "react";
import {
  Button,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { Box, Container, Text } from "@chakra-ui/react";
import Signup from "./components/Signup";
import Login from "./components/Login";
import { createBrowserHistory } from "history";
import { useNavigate } from "react-router-dom";
const Home = () => {
  const history = createBrowserHistory();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  }, []);
  return (
    <div className="formContainer">
      <Container maxW={"xl"} centerContent>
        <Box
          d="flex"
          justifyContent={"center"}
          w="100%"
          p={3}
          bg={"white"}
          m="10px 0 10px 0"
          borderRadius="lg"
          borderWidth="1px"
          textAlign={"center"}
        >
          <Text color={"black"} fontSize={"2xl"}>
            Login for Chat app
          </Text>
        </Box>

        <Box w="100%" borderRadius="lg" borderWidth="1px" p={3} bg={"white"}>
          <Tabs variant="soft-rounded" colorScheme="green">
            <TabList mb="2%">
              <Tab width="50%">Login</Tab>
              <Tab width="50%">Sign Up</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Login />
              </TabPanel>
              <TabPanel>
                <Signup />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Container>
    </div>
  );
};

export default Home;
