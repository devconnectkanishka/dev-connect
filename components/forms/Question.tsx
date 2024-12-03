"use client";

import { Editor } from "@tinymce/tinymce-react";
// import EditorJS from "@editorjs/editorjs";
// import Paragraph from "@editorjs/paragraph";
// import Quote from "@editorjs/quote";
// import Header from "@editorjs/header";
// import Warning from "@editorjs/warning";
// import Delimiter from "@editorjs/delimiter";
// import Alert from "editorjs-alert";
// import List from "@editorjs/list";
// import NestedList from "@editorjs/nested-list";
// import Checklist from "@editorjs/checklist";
// import ImageTool from "@editorjs/image";
// import SimpleImage from "@editorjs/simple-image";
// import LinkTool from "@editorjs/link";
// import AttachesTool from "@editorjs/attaches";
// import Embed from "@editorjs/embed";
// import Table from "@editorjs/table";
// import CodeTool from "@editorjs/code";
// import CodeTool from "@rxpm/editor-js-code";
// import Marker from "@editorjs/marker";
// import InlineCode from "@editorjs/inline-code";
// import Underline from "@editorjs/underline";

import editorJsHtml from "editorjs-html";
import DOMPurify from "dompurify";

import { KeyboardEvent, useEffect, useRef, useState, useMemo } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useTheme } from "@/context/ThemeProvider";
import { createQuestion, editQuestion } from "@/lib/actions/question.action";
import { QuestionSchema } from "@/lib/validations";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Badge } from "../ui/badge";
import { ITag } from "@/database/tag.model";
import { toast } from "../ui/use-toast";

interface Props {
  mongoUserId: string;
  type?: string;
  questionDetails?: string;
}

const Question = ({ mongoUserId, type, questionDetails }: Props) => {
  const { mode } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const editorRef = useRef();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const SaveDocument = async () => {
    const outputData = await editor.save();
    const edjsParser = editorJsHtml();
    const html = edjsParser.parse(outputData).join("");
    const sanitizedHtml = DOMPurify.sanitize(html);

    console.log("Sanitized HTML:", sanitizedHtml);
  };

  // const editor = new EditorJS({
  //   onChange: (api: any, event: Event) => {
  //     SaveDocument();
  //   },
  //   holder: "editorjs",
  //   tools: {
  //     header: Header,
  //     // quote: Quote,
  //     paragraph: {
  //       class: Paragraph,
  //       inlineToolbar: true,
  //     },
  //     // warning: {
  //     //   class: Warning,
  //     //   inlineToolbar: true,
  //     //   shortcut: "CMD+SHIFT+W",
  //     //   config: {
  //     //     titlePlaceholder: "Title",
  //     //     messagePlaceholder: "Message",
  //     //   },
  //     // },
  //     // delimiter: Delimiter,
  //     // alert: {
  //     //   class: Alert,
  //     //   inlineToolbar: true,
  //     //   shortcut: "CMD+SHIFT+A",
  //     //   config: {
  //     //     alertTypes: [
  //     //       "primary",
  //     //       "secondary",
  //     //       "info",
  //     //       "success",
  //     //       "warning",
  //     //       "danger",
  //     //       "light",
  //     //       "dark",
  //     //     ],
  //     //     defaultType: "primary",
  //     //     messagePlaceholder: "Enter something",
  //     //   },
  //     // },
  //     list: {
  //       class: NestedList,
  //       inlineToolbar: true,
  //       config: {
  //         defaultStyle: "unordered",
  //       },
  //     },
  //     // checklist: {
  //     //   class: Checklist,
  //     //   inlineToolbar: true,
  //     // },
  //     // image: {
  //     //   class: ImageTool,
  //     //   config: {
  //     //     endpoints: {
  //     //       byFile: "http://localhost:8008/uploadFile", // Your backend file uploader endpoint
  //     //       byUrl: "http://localhost:8008/fetchUrl", // Your endpoint that provides uploading by Url
  //     //     },
  //     //   },
  //     // },
  //     // linkTool: {
  //     //   class: LinkTool,
  //     //   config: {
  //     //     endpoint: "http://localhost:8008/fetchUrl", // Your backend endpoint for url data fetching,
  //     //   },
  //     // },
  //     // attaches: {
  //     //   class: AttachesTool,
  //     //   config: {
  //     //     endpoint: "http://localhost:8008/uploadFile",
  //     //   },
  //     // },
  //     embed: {
  //       class: Embed,
  //       config: {
  //         services: {
  //           youtube: true,
  //           coub: true,
  //         },
  //       },
  //     },
  //     // table: {
  //     //   class: Table,
  //     //   inlineToolbar: true,
  //     //   config: {
  //     //     rows: 2,
  //     //     cols: 3,
  //     //   },
  //     // },
  //     code: {
  //       class: CodeTool,
  //       config: {
  //         modes: {
  //           js: "JavaScript",
  //           py: "Python",
  //           go: "Go",
  //           cpp: "C++",
  //           cs: "C#",
  //           md: "Markdown",
  //           php: "PHP",
  //         },
  //         defaultMode: "go",
  //       },
  //     },
  //     Marker: {
  //       class: Marker,
  //       shortcut: "CMD+SHIFT+M",
  //     },
  //     inlineCode: {
  //       class: InlineCode,
  //       shortcut: "CMD+SHIFT+M",
  //     },
  //     underline: Underline,
  //   },
  // });

  const parsedQuestionDetails =
    type === "edit" ? JSON.parse(questionDetails || "") : "";

  const groupTags =
    type === "edit"
      ? parsedQuestionDetails.tags.map((tag: ITag) => tag.name)
      : [];

  // 1. Define your form.
  const form = useForm<z.infer<typeof QuestionSchema>>({
    resolver: zodResolver(QuestionSchema),
    defaultValues: {
      title: parsedQuestionDetails.title || "",
      explanation: parsedQuestionDetails.content || "",
      tags: groupTags || [],
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof QuestionSchema>) {
    setIsSubmitting(true);
    try {
      if (type === "edit") {
        await editQuestion({
          title: values.title,
          content: values.explanation,
          path: pathname,
          questionId: parsedQuestionDetails._id,
        });

        toast({
          title: "Question Details Successfully Updated",
          variant: "success",
        });

        //* navigate to question detail page
        router.push(`/question/${parsedQuestionDetails._id}`);
      } else {
        // Todo: make a async call to your API -> create question
        await createQuestion({
          title: values.title,
          tags: values.tags,
          content: values.explanation,
          author: JSON.parse(mongoUserId),
          path: pathname,
        });

        // Todo: contain all form data

        toast({
          title: `Question has been created`,
          variant: "success",
        });

        //* navigate to home page
        router.push("/");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
    console.log("You clicked submit.");
  }

  const handleInputKeyDown = (
    e: KeyboardEvent<HTMLInputElement>,
    field: any,
  ) => {
    if (e.key === "Enter" && field.name === "tags") {
      e.preventDefault();
      const tagInput = e.target as HTMLInputElement;
      const tagValue = tagInput.value.trim();
      if (tagValue !== "") {
        if (tagValue.length > 15) {
          return form.setError("tags", {
            type: "required",
            message: "Tag must be less than 15 characters.",
          });
        }
        if (!field.value.includes(tagValue as never)) {
          form.setValue("tags", [...field.value, tagValue]);
          tagInput.value = "";
          form.clearErrors("tags");
        }
      } else {
        form.trigger();
      }
    }
  };

  const handleTagRemove = (tag: string, field: any) => {
    const newTags = field.value.filter((t: string) => t !== tag);
    form.setValue("tags", newTags);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-10"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Question Title <span className="text-blue-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <Input
                  className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                  {...field}
                />
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Be specific and imagine you&apos;re asking question to another
                person.
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="explanation"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Detailed explanation of your problem{" "}
                <span className="text-blue-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <Editor
                  apiKey={process.env.NEXT_PUBLIC_TINY_MCE_API_KEY}
                  onInit={(evt, editor) => {
                    // @ts-ignore
                    editorRef.current = editor;
                  }}
                  onBlur={field.onBlur}
                  onEditorChange={(content) => field.onChange(content)}
                  initialValue={parsedQuestionDetails.content || ""}
                  init={{
                    height: 350,
                    menubar: false,
                    plugins: [
                      "advlist",
                      "autolink",
                      "lists",
                      "link",
                      "image",
                      "charmap",
                      "preview",
                      "emoticons",
                      "anchor",
                      "searchreplace",
                      "visualblocks",
                      "codesample",
                      "fullscreen",
                      "insertdatetime",
                      "media",
                      "table",
                    ],
                    toolbar:
                      "undo redo | " +
                      "codesample | bold italic forecolor | alignleft aligncenter |" +
                      "alignright alignjustify | bullist numlist | emoticons",
                    content_style:
                      "body { font-family:Ubuntu; font-size:16px }",
                    skin: mode === "dark" ? "oxide-dark" : "oxide",
                    content_css: mode === "dark" ? "dark" : "light",
                  }}
                />

                {/* <div id="editorjs"></div> */}
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Introduce the problem and expand on what you put in the title.
                Minimum 20 characters.
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Tags <span className="text-blue-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <>
                  <Input
                    disabled={type === "edit"}
                    className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                    placeholder="Add tags..."
                    onKeyDown={(e) => handleInputKeyDown(e, field)}
                  />
                  {field.value.length > 0 && (
                    <div className="flex-start mt-2.5 gap-2.5">
                      {field.value.map((tag: any) => (
                        <Badge
                          key={tag}
                          className="subtle-medium background-light800_dark300 text-light400_light500 flex items-center justify-center gap-2 rounded-md border-none px-4 py-2 capitalize"
                          onClick={() =>
                            type !== "edit"
                              ? handleTagRemove(tag, field)
                              : () => {}
                          }
                        >
                          {tag}
                          {type !== "edit" && (
                            <Image
                              src="/assets/icons/close.svg"
                              alt="close"
                              width={12}
                              height={12}
                              className="cursor-pointer object-contain invert-0 dark:invert"
                            />
                          )}
                        </Badge>
                      ))}
                    </div>
                  )}
                </>
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Add upto 3 tags to describe your question is about. You need to
                press enter to add a tag.
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <Button
          disabled={isSubmitting}
          type="submit"
          className="primary-gradient w-fit !text-light-900"
        >
          {isSubmitting ? (
            <>{type === "edit" ? "Editing..." : "Posting..."}</>
          ) : (
            <>{type === "edit" ? "Edit Question" : "Ask a Question"}</>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default Question;
