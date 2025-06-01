// 'use client';

// import { useFormContext, Controller } from 'react-hook-form';
// import { Button } from '@/components/ui/button';
// import { Label } from '@/components/ui/label';
// import { Upload, UploadProps } from 'antd';
// import { UploadOutlined } from '@ant-design/icons';
// import { cn } from '@/lib/utils';

// export function Documents() {
//   const { control } = useFormContext();

//   const normFile = (e: any) => {
//     if (Array.isArray(e)) return e;
//     return e?.fileList;
//   };

//   const uploadProps: UploadProps = {
//     listType: 'picture',
//     beforeUpload: () => false, // prevent automatic upload
//     multiple: false,
//   };

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//       {/* Applicant Photo */}
//       <div className="space-y-2">
//         <Label>Applicant Photo</Label>
//         <Controller
//           name="documents.applicantPhoto"
//           control={control}
//           defaultValue={[]}
//           render={({ field }) => (
//             <Upload
//               {...uploadProps}
//               fileList={field.value}
//               onChange={(info) => field.onChange(normFile(info))}
//             >
//               <Button variant="outline" type="button" icon={<UploadOutlined />}>
//                 Click to Upload Photo
//               </Button>
//             </Upload>
//           )}
//         />
//       </div>

//       {/* Applicant Signature */}
//       <div className="space-y-2">
//         <Label>Applicant Signature</Label>
//         <Controller
//           name="documents.applicantSignature"
//           control={control}
//           defaultValue={[]}
//           render={({ field }) => (
//             <Upload
//               {...uploadProps}
//               fileList={field.value}
//               onChange={(info) => field.onChange(normFile(info))}
//             >
//               <Button variant="outline" type="button" icon={<UploadOutlined />}>
//                 Click to Upload Signature
//               </Button>
//             </Upload>
//           )}
//         />
//       </div>
//     </div>
//   );
// }
