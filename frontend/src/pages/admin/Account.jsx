import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";

import { getAccounts, createAccount, updateAccount } from "../../lib/api";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

import { Pencil, Plus, Search, ShieldCheck, Shield, UserCog} from "lucide-react";

const createSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  is_admin: z.string(),
});

const updateSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  is_admin: z.string(),
});

const createDefaults = { email: "", password: "", is_admin: "0" };
const updateDefaults = { email: "", is_admin: "0" };

const mapAccount = (item) => ({
  id: item.account_id,
  email: item.email || "",
  createdAt: item.created_at || "",
  isAdmin: Number(item.is_admin) === 1 ? 1 : 0,
  isDisabled: Number(item.is_disabled) === 1 ? 1 : 0,
  role: Number(item.is_admin) === 1 ? "Admin" : "User",
});

const roleBadgeClass = (role) =>
  role === "Admin"
    ? "bg-blue-100 text-blue-700 hover:bg-blue-100"
    : "bg-slate-100 text-slate-700 hover:bg-slate-100";

function RoleField({ control, name = "is_admin" }) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Quyền</FormLabel>
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Chọn quyền" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="0">User</SelectItem>
              <SelectItem value="1">Admin</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default function AccountPage() {
  const [accounts, setAccounts] = useState([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const createForm = useForm({
    resolver: zodResolver(createSchema),
    defaultValues: createDefaults,
  });

  const updateForm = useForm({
    resolver: zodResolver(updateSchema),
    defaultValues: updateDefaults,
  });

  const fetchAccounts = async () => {
    try {
      const res = await getAccounts();
      setAccounts((res?.data || []).map(mapAccount));
    } catch (error) {
      console.error("Fetch accounts error:", error);
      toast.error(error.message || "Không thể tải danh sách tài khoản");
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const filteredAccounts = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return accounts.filter(
      (item) =>
        item.email.toLowerCase().includes(keyword) ||
        item.role.toLowerCase().includes(keyword) ||
        String(item.id).includes(keyword)
    );
  }, [accounts, search]);

  const closeDialog = (value) => {
    setOpen(value);
    if (!value) {
      setEditingAccount(null);
      createForm.reset(createDefaults);
      updateForm.reset(updateDefaults);
    }
  };

  const openCreate = () => {
    setEditingAccount(null);
    createForm.reset(createDefaults);
    setOpen(true);
  };

  const openEdit = (item) => {
    setEditingAccount(item);
    updateForm.reset({
      email: item.email,
      is_admin: String(item.isAdmin),
    });
    setOpen(true);
  };

  const handleCreate = async (values) => {
    try {
      setSubmitting(true);

      await createAccount({
        email: values.email.trim(),
        password: values.password,
        is_admin: Number(values.is_admin),
      });

      toast.success("Tạo tài khoản thành công!");
      await fetchAccounts();
      closeDialog(false);
    } catch (error) {
      console.error("Create account error:", error);
      toast.error(error.message || "Không thể tạo tài khoản");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (values) => {
    try {
      setSubmitting(true);

      await updateAccount(editingAccount.id, {
        is_admin: Number(values.is_admin),
        is_disabled: editingAccount.isDisabled,
      });

      toast.success("Cập nhật tài khoản thành công!");
      await fetchAccounts();
      closeDialog(false);
    } catch (error) {
      console.error("Update account error:", error);
      toast.error(error.message || "Không thể cập nhật tài khoản");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleAdmin = async (item) => {
  const nextAdmin = item.isAdmin === 1 ? 0 : 1;

  try {
    await updateAccount(item.id, {
      is_admin: nextAdmin,
      is_disabled: item.isDisabled,
    });

    toast.success(
      nextAdmin === 1
        ? `Đã cấp quyền admin cho "${item.email}"`
        : `Đã gỡ quyền admin của "${item.email}"`
    );

    await fetchAccounts();
  } catch (error) {
    console.error("Toggle admin error:", error);
    toast.error(error.message || "Không thể cập nhật quyền");
  }
};

  const stats = [
    { label: "Tổng tài khoản", value: accounts.length },
    {
      label: "Admin",
      value: accounts.filter((item) => item.isAdmin === 1).length,
    },
    {
      label: "User",
      value: accounts.filter((item) => item.isAdmin === 0).length,
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Trang tài khoản</h1>

      <div className="flex items-center justify-between">
        <Dialog open={open} onOpenChange={closeDialog}>
          <DialogTrigger asChild>
            <Button
              onClick={openCreate}
              className="flex items-center gap-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
            >
              <Plus size={16} />
              Thêm tài khoản
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[760px] rounded-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingAccount ? "Cập nhật tài khoản" : "Thêm tài khoản"}
              </DialogTitle>
            </DialogHeader>

            {!editingAccount ? (
              <Form {...createForm}>
                <form
                  onSubmit={createForm.handleSubmit(handleCreate)}
                  className="space-y-4"
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={createForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="VD: user@gmail.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={createForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mật khẩu</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Nhập mật khẩu"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <RoleField control={createForm.control} />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setOpen(false)}
                      disabled={submitting}
                    >
                      Hủy
                    </Button>
                    <Button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700"
                      disabled={submitting}
                    >
                      {submitting ? "Đang tạo..." : "Tạo tài khoản"}
                    </Button>
                  </div>
                </form>
              </Form>
            ) : (
              <Form {...updateForm}>
                <form
                  onSubmit={updateForm.handleSubmit(handleUpdate)}
                  className="space-y-4"
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={updateForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input {...field} disabled />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <RoleField control={updateForm.control} />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setOpen(false)}
                      disabled={submitting}
                    >
                      Hủy
                    </Button>
                    <Button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700"
                      disabled={submitting}
                    >
                      {submitting ? "Đang cập nhật..." : "Cập nhật"}
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </DialogContent>
        </Dialog>

        <div className="relative w-64">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder="Tìm kiếm..."
            className="bg-white pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((item) => (
          <Card key={item.label} className="rounded-2xl">
            <CardContent className="p-5">
              <div className="text-sm text-muted-foreground">{item.label}</div>
              <div className="mt-2 text-2xl font-bold">{item.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="rounded-2xl">
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/30">
              <tr className="text-left">
                <th className="px-6 py-4 font-medium">ID</th>
                <th className="px-6 py-4 font-medium">Tài khoản</th>
                <th className="px-6 py-4 font-medium">Quyền</th>
                <th className="px-6 py-4 font-medium">Ngày tạo</th>
                <th className="px-6 py-4 text-right font-medium">Hành động</th>
              </tr>
            </thead>

            <tbody>
              {filteredAccounts.map((item) => (
                <tr
                  key={item.id}
                  className="border-b last:border-b-0 hover:bg-muted/20"
                >
                  <td className="px-6 py-4">{item.id}</td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                        {item.isAdmin === 1 ? (
                          <ShieldCheck size={18} className="text-blue-600" />
                        ) : (
                          <UserCog
                            size={18}
                            className="text-muted-foreground"
                          />
                        )}
                      </div>
                      <span className="font-medium">{item.email}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <Badge className={`rounded-full px-3 py-1 ${roleBadgeClass(item.role)}`}>
                      {item.role}
                    </Badge>
                  </td>

                  <td className="px-6 py-4">
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString("vi-VN")
                      : ""}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        className="flex items-center gap-1 bg-indigo-600 text-white hover:bg-indigo-700"
                        onClick={() => handleToggleAdmin(item)}
                      >
                        {item.isAdmin === 1 ? (
                          <>
                            <Shield size={14} />
                            Gỡ admin
                          </>
                        ) : (
                          <>
                            <ShieldCheck size={14} />
                            Cấp admin
                          </>
                        )}
                      </Button>

                      <Button
                        size="sm"
                        className="flex items-center gap-1 bg-yellow-400 text-white hover:bg-yellow-500"
                        onClick={() => openEdit(item)}
                      >
                        <Pencil size={14} />
                        Sửa
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredAccounts.length === 0 && (
            <div className="py-10 text-center text-sm text-muted-foreground">
              Không có tài khoản nào
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}