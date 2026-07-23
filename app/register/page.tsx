"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupFormSchema, SignupFormInput } from "@/lib/definitions";
import { registerAction } from "./actions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<SignupFormInput>({
    resolver: zodResolver(SignupFormSchema),
    defaultValues: {
      classCode: "",
      fullName: "",
      lrn: "",
      password: "",
      confirmPassword: "",
      isGroup: false,
      groupName: "",
    },
  });

  const isGroup = form.watch("isGroup");

  async function onSubmit(data: SignupFormInput) {
    setServerError(null);
    const result = await registerAction(data);
    
    if (result.status === "error") {
      if (result.message) {
        setServerError(result.message);
      }
      if (result.errors) {
        Object.entries(result.errors).forEach(([key, messages]) => {
          form.setError(key as keyof SignupFormInput, { type: "server", message: messages[0] });
        });
      }
    } else if (result.status === "success") {
      toast.success(result.message);
        //  router.push("/dashboard");
      window.location.href = "/dashboard";
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight">Student Registration</CardTitle>
          <CardDescription>Join your class to access civic scenarios.</CardDescription>
        </CardHeader>
        <CardContent>
          {serverError && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              
              <FormField
                control={form.control}
                name="classCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Class Code</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. CVC-3A" {...field} />
                    </FormControl>
                    <FormDescription>The 6-character code provided by your teacher.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Juan Dela Cruz" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lrn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LRN</FormLabel>
                    <FormControl>
                      <Input placeholder="12-digit Learner Reference Number" maxLength={12} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isGroup"
                render={({ field }) => (
                  <FormItem className="space-y-3 pt-2">
                    <FormLabel>Are you working as an individual or a group?</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(val) => field.onChange(val === "group")}
                        value={field.value ? "group" : "individual"}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="individual" />
                          </FormControl>
                          <FormLabel className="font-normal">Individual</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="group" />
                          </FormControl>
                          <FormLabel className="font-normal">Group</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {isGroup && (
                <FormField
                  control={form.control}
                  name="groupName"
                  render={({ field }) => (
                    <FormItem className="animate-in fade-in slide-in-from-top-2">
                      <FormLabel>Group Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Group A" {...field} />
                      </FormControl>
                      <FormDescription>If your group already exists, type the exact name to join it.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full mt-6" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Registering...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center border-t p-4">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline font-medium">
              Log in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
