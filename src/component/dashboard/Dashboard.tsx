import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { SelectChangeEvent, TableContainer } from "@mui/material";
import {
  TextField,
  Modal,
  Button,
  FormControlLabel,
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
  Backdrop,
  Snackbar,
  Alert,
} from "@mui/material";
import { InputAdornment } from "@mui/material";
import { Search } from "@mui/icons-material";

import { RootState } from "../../store";
import { useSelector } from "react-redux";

interface UserData {
  name: string;
  designation: string;
  joinDate: string;
  gender: string;
  position: string[];
}

const Dashboard: React.FC = () => {
  const location = useLocation();
  const username = location.state?.username;
  const name = username?.split("@")[0];
  const navigate = useNavigate();
  const { loginData } = useSelector((state: RootState) => state.login);
  console.log(loginData);

  const logoutclick = () => {
    navigate("/");
  };
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [users, setUsers] = useState<UserData[]>([]);
  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  //for opening modal
  const handleOpen = (index: number | null = null) => {
    setSelectedUser(index !== null ? users[index] : null);
    setFormData(index !== null ? { ...users[index] } : { ...formData });
    setSelectedIndex(index);
    setOpen(true);
  };

  //for closing modal
  const handleClose = () => {
    setOpen(false);
    setShowConfirmation(false);
  };

  //for initialize data feilds to null
  const [formData, setFormData] = useState<UserData>({
    name: "",
    designation: "",
    joinDate: "",
    gender: "",
    position: [],
  });

  useEffect(() => {
    if (!open) {
      setFormData({
        name: "",
        designation: "",
        joinDate: "",
        gender: "",
        position: [],
      });
      setFormErrors({});
    }
  }, [open]);

  useEffect(() => {
    // Retrieve data from local storage when component mounts
    const storedData = localStorage.getItem("users");
    if (storedData) {
      setUsers(JSON.parse(storedData));
    }
  }, []);

  useEffect(() => {
    // Save data to local storage whenever the 'users' state changes
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  //handling input feids of the modal
  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name as string]: value as string,
    }));

    if (value === "") {
      setFormErrors((prevState) => ({
        ...prevState,
        [name as keyof UserData]: "Please enter a value.",
      }));
    } else {
      setFormErrors((prevState) => ({
        ...prevState,
        [name as keyof UserData]: "",
      }));
    }

    if (selectedUser) {
      setSelectedUser({ ...selectedUser, [name as string]: value });
    }
  };

  //handling checkbox input

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    let updatedPosition = formData.position.slice();
    if (checked) {
      updatedPosition.push(name);
    } else {
      updatedPosition = updatedPosition.filter((pos) => pos !== name);
    }
    setFormData((prevState) => ({
      ...prevState,
      position: updatedPosition,
    }));
    setFormErrors((prevState) => ({
      ...prevState,
      position: [],
    }));

    if (selectedUser) {
      setSelectedUser((prevState) => {
        if (prevState) {
          return {
            ...prevState,
            position: checked
              ? [...prevState.position, name]
              : prevState.position.filter((pos) => pos !== name),
          };
        }
        return prevState;
      });
    }
  };

  //handling gender input
  const handleUserChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    setFormErrors((prevState) => ({
      ...prevState,
      gender: "",
    }));

    if (selectedUser) {
      setSelectedUser((prevState) => ({
        ...prevState!,
        [name!]: value,
      }));
    }
  };

  //displaying form errors
  const [formErrors, setFormErrors] = useState<Partial<UserData>>({
    name: "",
    designation: "",
    joinDate: "",
  });
  //for showing notification of data stored successfully
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    setSnackbarMessage("");
  };

  //for saving data and validation
  const handleSave = (
    e: React.FormEvent<HTMLFormElement>,
    selectedIndex: number | null
  ) => {
    e.preventDefault();

    const errors: Partial<UserData> = {};

    if (formData.name.trim() === "") {
      errors.name = "Please enter a name.";
    }
    if (formData.designation.trim() === "") {
      errors.designation = "Please enter a designation.";
    }
    if (formData.joinDate.trim() === "") {
      errors.joinDate = "Please select a join date.";
    }
    if (formData.gender === "") {
      errors.gender = "Please select a gender.";
    }
    if (formData.position.length === 0) {
      if (errors.position) {
        errors.position.push("Please select at least one position.");
      } else {
        errors.position = ["Please select at least one position."];
      }
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    if (selectedUser) {
      // Update existing user
      const updatedUsers = [...users];
      if (selectedIndex !== null) {
        updatedUsers[selectedIndex] = selectedUser;
        setUsers(updatedUsers);
      }
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      setSnackbarMessage("Data updated successfully.");
    } else {
      // Add new user
      setUsers((prevState) => [...prevState, formData]);
      setSnackbarMessage("Data saved successfully.");
    }

    // setUsers((prevState) => [...prevState, formData]);
    setFormData({
      name: "",
      designation: "",
      joinDate: "",
      gender: "",
      position: [],
    });

    setOpen(false);
    setLoading(true);
    setTimeout(() => {
      setLoading(false); // Hide the progress bar
      // setSnackbarMessage();
      setSnackbarOpen(true);
    }, 1000);
  };

  const handleDelete = (index: number) => {
    setShowConfirmation(true);

    setSelectedIndex(index);
  };
  const handleConfirmDelete = () => {
    const newUsers = [...users];
    localStorage.setItem("users", JSON.stringify(newUsers));
    newUsers.splice(selectedIndex!, 1);
    setUsers(newUsers);
    setShowConfirmation(false);
    setSnackbarOpen(true);
    setSnackbarMessage("Data deleted successfully.");
  };
  const handleCancelDelete = () => {
    setShowConfirmation(false);
  };

  const handleEdit = (user: UserData) => {
    const index = users.findIndex((u) => u === user);
    setSelectedUser(user);
    handleOpen(index);
  };
  return (
    <div className="dashboard-body">
      <h1>Welcome to the Dashboard</h1>
      {loginData.map((data:any, index:number) => (
        <div key={index}>
          <h2>USERNAME: {data.username}</h2>
          {/* <h2>PASSWORD: {data.password}</h2> */}
        </div>
      ))}
      <div className="button-log" >
        <Button
          // variant="outlined"
          className="logout"
          type="button"
          onClick={logoutclick}
          style={{color:"#666262 ", border:"1px solid #666262 "}}
        >
          Logout
        </Button>
        
        <Button
          variant="contained"
          onClick={() => {
            setSelectedUser(null);
            handleOpen();
          }}
           style={{background:"#666262 "}}
        >
          Add
        </Button>
      </div>
      <TextField
        label="Search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
        fullWidth
        style={{ marginBottom: "16px" }}
      />

      <Modal open={open} onClose={handleClose}>
        <div
          className="add-popup"
          style={{
            padding: "16px",
            background: "#fff",
            width: "400px",
            margin: "0 auto",
            top: "50%",
            position: "absolute",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <h2>Add User</h2>
          <form onSubmit={(e) => handleSave(e, selectedIndex)}>
            <TextField
              label="Name"
              name="name"
              value={selectedUser?.name || formData.name}
              onChange={handleFormChange}
              error={!!formErrors.name}
              fullWidth
            />
            <TextField
              label="Designation"
              name="designation"
              value={selectedUser?.designation || formData.designation}
              onChange={handleFormChange}
              error={!!formErrors.designation}
              fullWidth
            />
            <FormControl fullWidth error={!!formErrors.gender}>
              <InputLabel id="gender-label">Gender</InputLabel>
              <Select
                labelId="gender-label"
                id="gender"
                name="gender"
                value={selectedUser ? selectedUser.gender : formData.gender}
                onChange={handleUserChange}
              >
                <MenuItem value="">Select Gender</MenuItem>
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
              {formErrors.gender && (
                <span style={{ color: "red" }} className="error">
                  {formErrors.gender}
                </span>
              )}
            </FormControl>
            <FormControl>
              <InputLabel id="join-date">Join Date</InputLabel>
              <br />
              <br />
              <TextField
                name="joinDate"
                type="date"
                value={selectedUser ? selectedUser.joinDate : formData.joinDate}
                onChange={handleFormChange}
                error={!!formErrors.joinDate}
                helperText={formErrors.joinDate}
                fullWidth
              />
            </FormControl>

            <InputLabel id="position">Position</InputLabel>
            <FormControl fullWidth error={!!formErrors.position}>
              <FormControlLabel
                control={
                  <Checkbox
                    {...label}
                    name="developer"
                    onChange={handleCheckboxChange}
                    checked={
                      selectedUser
                        ? selectedUser.position.includes("developer")
                        : formData.position.includes("developer")
                    }
                  />
                }
                label="Developer"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    {...label}
                    name="designer"
                    onChange={handleCheckboxChange}
                    checked={
                      selectedUser
                        ? selectedUser.position.includes("designer")
                        : formData.position.includes("designer")
                    }
                  />
                }
                label="Designer"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    {...label}
                    name="manager"
                    onChange={handleCheckboxChange}
                    checked={
                      selectedUser
                        ? selectedUser.position.includes("manager")
                        : formData.position.includes("manager")
                    }
                  />
                }
                label="Manager"
              />
              {formErrors.position && (
                <span className="error" style={{ color: "red" }}>
                  {formErrors.position}
                </span>
              )}
            </FormControl>
            <Button variant="contained" color="secondary" type="submit" style={{background:"#666262 "}}>
              {selectedUser !== null ? "Update" : "Save"}
            </Button>
          </form>
        </div>
      </Modal>
      <Modal open={showConfirmation} onClose={handleCancelDelete}>
        <div
          className="confirmation-popup"
          style={{
            padding: "16px",
            background: "#fff",
            width: "400px",
            margin: "0 auto",
            top: "50%",
            position: "absolute",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <h2>Confirm Delete</h2>
          <p>Are you sure you want to delete this user?</p>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleConfirmDelete}
            style={{background:"#666262 "}}
          >
            Delete
          </Button>
          <span> </span>
          <span> </span>
          <Button variant="outlined" onClick={handleCancelDelete} style={{color:"#666262 ", border:"1px solid #666262 "}}>
            Cancel
          </Button>
        </div>
      </Modal>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleSnackbarClose} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Backdrop open={loading} style={{ zIndex: 9999 }}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Designation</TableCell>
            <TableCell>Join Date</TableCell>
            <TableCell>Gender</TableCell>
            <TableCell>Position</TableCell>
            <TableCell>Actions</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        {/* {users.length=== 0?(
          <p>No Data available</p>
        ):(
        */}
        <TableBody>
          {users
            .filter(
              (user) =>
                user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.designation
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase())
            )
            .map((user, index) => (
              <TableRow key={index}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.designation}</TableCell>
                <TableCell>{user.joinDate}</TableCell>
                <TableCell>{user.gender}</TableCell>
                <TableCell>{user.position}</TableCell>

                <TableCell>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleEdit(user)}
                    style={{background:"#666262 ",}}
                  >
                    Edit
                  </Button>
                  <span> </span>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDelete(index)}
                    style={{background:"#666262 ",}}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
        {/*                    
           )
          } */}
      </Table>
      <TableContainer>
        {(users.length === 0 ||
          users.every(
            (user) =>
              !user.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
              !user.designation
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
          )) && <div style={{ fontSize: "20px" }}>No employees found!</div>}
      </TableContainer>
    </div>
  );
};
export default Dashboard;
