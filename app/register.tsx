"use client";

import { Button, DatePicker, Input, Link } from "@nextui-org/react";
import TransactionPINInput from "./(pwa)/account/transaction-pin-input";
import AuthFlowNavigationTop from "./(pwa)/auth-flow-navigation-top";
import { MailPlus, XIcon } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";
import { useUserContext } from "./user-session-provider";
import { AppwriteException } from "appwrite";
import { redirect, useRouter } from "next/navigation";
import { TypeOf, z, ZodError } from "zod";

const generalErrorMessageTemplates = {
  unexpected: "Something unexpected happened. Its not you, its us",
};

const inputErrorClassNames = "pt-1 text-sm text-red-200";

const registrationFormSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long." })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter.",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter.",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number." })
      .regex(/[\W_]/, {
        message: "Password must contain at least one special character.",
      }),
    retypedPassword: z.string(),
  })
  .refine((data: any) => data.password === data.retypedPassword, {
    message: "Passwords do not match.",
    path: ["retypedPassword"],
  });
// .superRefine((data, ctx) => {
//   const message = "Passwords do not match.";
//   if (data.password !== data.retypedPassword) {
//     ctx.addIssue({
//       code: z.ZodIssueCode.custom,
//       path: ["password"],
//       message,
//     });
//     ctx.addIssue({
//       code: z.ZodIssueCode.custom,
//       path: ["retypedPassword"],
//       message,
//     });
//   }
// });

export default function RegisterPage() {
  const router = useRouter();
  const userContext = useUserContext();
  const [eligible, setEligible] = useState(false);

  const [email, setEmail] = useState("test-5@gmail.com");
  const [password, setPassword] = useState("P@ssw0rd");
  const [retypedPassword, setRetypedPassword] = useState("P@ssw0rd");

  const [formErrors, setFormErrors] = useState<{
    [key: string]: string[] | null;
  }>({
    _all: null,
    email: null,
    password: null,
    retypedPassword: null,
  });

  const handleRegisteration = async () => {
    try {
      registrationFormSchema.parse({
        email,
        password,
        retypedPassword,
      });
      await userContext.register(email, password);
      router.replace("/email-verification");
    } catch (exception) {
      if (exception instanceof ZodError) {
        type RegistrationForm = z.infer<typeof registrationFormSchema>;
        const { email, password, retypedPassword } = (
          exception as z.ZodError<RegistrationForm>
        ).format();
        setFormErrors((prevErrors) => {
          return {
            ...prevErrors,
            email: email?._errors || null,
            password: password?._errors || null,
            retypedPassword: retypedPassword?._errors || null,
          };
        });
      } else if (exception instanceof AppwriteException) {
        const { type, message } = exception;
        console.log("type: ", type);
        console.log("excep msg: ", message);
        if (type === "user_already_exists") {
          setFormErrors((prevErrors) => {
            return {
              ...prevErrors,
              email: [
                "An account is already registered with this email address. Login or Reset Password",
              ],
            } as any;
          });
        }
      } else {
        throw exception;
      }
    }
  };

  const clearGeneralFormError = () => {
    setFormErrors((prevErrors) => {
      return {
        ...prevErrors,
        _all: null,
      };
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <AuthFlowNavigationTop
        renderCTA={() => (
          <Button as={Link} color="default" size="sm" radius="sm" href="/login">
            Login
          </Button>
        )}
      />

      <main>
        <section className="pt-12 py-8 px-4 max-w-lg mx-auto">
          <header>
            <MailPlus className="block mx-auto size-10 mb-2 sm:size-12 sm:mb-4" />
            <h1 className="text-2xl sm:text-3xl text-center mb-1 sm:mb-2 font-medium">
              Create an account ✨
            </h1>
            <p className="text-sm text-zinc-400 text-center">
              Start your exciting journey with us today.
            </p>
          </header>

          <form className={clsx("pt-10", { hidden: eligible })}>
            <p
              data-description="general-form-error"
              className={clsx(
                " flex items-center gap-x-6 p-2.5 mb-10 border border-danger-300 bg-danger-50 rounded-lg text-sm text-danger-900",
                {
                  hidden: formErrors._all === null,
                }
              )}
            >
              <span className="w-full px-1">{formErrors?._all}</span>

              <Button
                isIconOnly
                size="sm"
                color="danger"
                radius="sm"
                onPress={clearGeneralFormError}
              >
                <XIcon className="size-4" />
              </Button>
            </p>

            <section className="grid gap-y-6 mb-10">
              <Input
                isRequired
                size="md"
                type="email"
                radius="sm"
                label="Email"
                placeholder=""
                value={email}
                onValueChange={setEmail}
                isInvalid={formErrors?.email !== null}
                errorMessage={formErrors?.email}
                classNames={{ errorMessage: inputErrorClassNames }}
              />
              <Input
                radius="sm"
                type="password"
                label="Password"
                value={password}
                onValueChange={setPassword}
                isInvalid={formErrors?.password !== null}
                errorMessage={
                  formErrors?.password && formErrors?.password.length === 1 ? (
                    formErrors?.password
                  ) : (
                    <ul className="flex flex-col gap-y-1 list-disc marker:text-danger-400 ps-5">
                      {formErrors?.password?.map((error) => {
                        return <li>{error}</li>;
                      })}
                    </ul>
                  )
                }
                classNames={{ errorMessage: inputErrorClassNames }}
              />
              <Input
                radius="sm"
                type="password"
                label="Re-type Password"
                value={retypedPassword}
                onValueChange={setRetypedPassword}
                isClearable
                isInvalid={formErrors?.retypedPassword !== null}
                errorMessage={formErrors?.retypedPassword}
                classNames={{ errorMessage: inputErrorClassNames }}
              />
            </section>

            <Button
              color="primary"
              variant="solid"
              fullWidth
              radius="sm"
              size="lg"
              // onClick={() => setEligible(true)}
              onPress={() => handleRegisteration()}
            >
              Register
            </Button>
          </form>

          <form className={clsx("pt-10", { hidden: !eligible })}>
            <section className="grid gap-y-6 mb-10">
              <div className="flex flex-wrap sm:flex-nowrap gap-4 w-full">
                <Input size="md" radius="sm" label="First Name" />
                <Input size="md" radius="sm" label="Last Name" />
              </div>
              <DatePicker
                isRequired
                radius="sm"
                label="Date of Birth"
                showMonthAndYearPickers
              />
              {/* <Input size="md" radius="sm" label="Transaction PIN" /> */}
              <div className="bg-zinc-800 rounded-lg p-2.5">
                <label
                  htmlFor="transaction-pin"
                  className="text-sm text-zinc-300 block mb-1.5"
                >
                  Transaction PIN
                </label>
                <TransactionPINInput />
              </div>
            </section>

            <Button
              as={Link}
              href="/dashboard"
              color="primary"
              variant="solid"
              fullWidth
              radius="sm"
              size="lg"
            >
              Done! Go-to Dashboard
            </Button>
          </form>
        </section>
      </main>
    </div>
  );
}