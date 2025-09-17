import "./App.css";
import { useAtom } from "jotai";
import {
  addUserAtom,
  checkedUserAtom,
  getUsersAtom,
  removeUserAtom,
  updateUserAtom,
  usersAtom,
} from "./store/atoms";
import { useEffect, useState } from "react";
import { Button } from "./components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./components/ui/dialog";
import { Input } from "./components/ui/input";
import { Checkbox } from "./components/ui/checkbox";
import { Label } from "./components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { Search, Edit, Trash2, Filter, UserPlus, CheckCircle2, XCircle } from "lucide-react";

const App = () => {
  const [data] = useAtom(usersAtom);
  const [, get] = useAtom(getUsersAtom);
  const [, addUser] = useAtom(addUserAtom);
  const [, deleteUser] = useAtom(removeUserAtom);
  const [, updatedUser] = useAtom(updateUserAtom);
  const [, checkedUser] = useAtom(checkedUserAtom);
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [idx, setIdx] = useState(null);
  const [element, setElement] = useState({
    id: null,
    name: "",
    age: "",
    address: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const handleSubmit = (e) => {
    e.preventDefault();
    const newUser = {
      name: e.target["name"].value,
      age: e.target["age"].value,
      address: e.target["address"].value,
      status: false,
    };
    addUser(newUser);
    setOpen(false);
  };

  const handleEdit = (elem) => {
    setIdx(elem.id);
    setElement(elem);
    setOpenEdit(true);
  };

  const handleChangeEdit = (e) => {
    e.preventDefault();
    const updated = {
      ...element,
      [e.target.name]: e.target.value,
    };
    updatedUser(updated);
    setOpenEdit(false);
  };
  

  const filteredData = data
    .filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.age.toString().includes(searchTerm)
    )
    .filter(user => 
      statusFilter === "all" || 
      (statusFilter === "active" && user.status) || 
      (statusFilter === "inactive" && !user.status)
    );

  useEffect(() => {
    get();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="bg-slate-50 border-b">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="text-2xl font-bold text-slate-800">User Management</CardTitle>
                <CardDescription>Manage your users efficiently</CardDescription>
              </div>
              
              <Button onClick={() => setOpen(true)} className="gap-2">
                <UserPlus size={16} />
                Add User
              </Button>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search users..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant={statusFilter === "all" ? "default" : "outline"} 
                  onClick={() => setStatusFilter("all")}
                  size="sm"
                >
                  All
                </Button>
                <Button 
                  variant={statusFilter === "active" ? "default" : "outline"} 
                  onClick={() => setStatusFilter("active")}
                  size="sm"
                  className="gap-1"
                >
                  <CheckCircle2 size={14} />
                  Active
                </Button>
                <Button 
                  variant={statusFilter === "inactive" ? "default" : "outline"} 
                  onClick={() => setStatusFilter("inactive")}
                  size="sm"
                  className="gap-1"
                >
                  <XCircle size={14} />
                  Inactive
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground py-8">
                        <UserPlus className="h-12 w-12 opacity-20 mb-2" />
                        <p>No users found.</p>
                        <p className="text-sm">Try adjusting your search or add a new user.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData.map((elem) => (
                    <TableRow key={elem.id}>
                      <TableCell className="font-medium">{elem.name}</TableCell>
                      <TableCell>
                        <Badge variant={elem.status ? "default" : "secondary"} className="gap-1">
                          {elem.status ? (
                            <>
                              <CheckCircle2 size={12} />
                              Active
                            </>
                          ) : (
                            <>
                              <XCircle size={12} />
                              Inactive
                            </>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell>{elem.age}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{elem.address}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Checkbox
                            checked={elem.status}
                            onCheckedChange={() => checkedUser(elem)}
                            className="h-5 w-5"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(elem)}
                            className="h-8 gap-1"
                          >
                            <Edit size={14} />
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteUser(elem.id)}
                            className="h-8 gap-1"
                          >
                            <Trash2 size={14} />
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Add User Dialog */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Enter the user details below. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    required
                    placeholder="Full name"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="age" className="text-right">
                    Age
                  </Label>
                  <Input
                    id="age"
                    name="age"
                    type="number"
                    required
                    placeholder="Age"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="address" className="text-right">
                    Address
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    required
                    placeholder="Address"
                    className="col-span-3"
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)} type="button">
                  Cancel
                </Button>
                <Button type="submit">
                  Add User
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit User Dialog */}
        <Dialog open={openEdit} onOpenChange={setOpenEdit}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>
                Make changes to the user profile here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleChangeEdit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="edit-name"
                    name="name"
                    value={element.name}
                    onChange={(e) => setElement(prev => ({...prev, name: e.target.value}))}
                    required
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-age" className="text-right">
                    Age
                  </Label>
                  <Input
                    id="edit-age"
                    name="age"
                    type="number"
                    value={element.age}
                    onChange={(e) => setElement(prev => ({...prev, age: e.target.value}))}
                    required
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-address" className="text-right">
                    Address
                  </Label>
                  <Input
                    id="edit-address"
                    name="address"
                    value={element.address}
                    onChange={(e) => setElement(prev => ({...prev, address: e.target.value}))}
                    required
                    className="col-span-3"
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpenEdit(false)} type="button">
                  Cancel
                </Button>
                <Button type="submit">
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default App;