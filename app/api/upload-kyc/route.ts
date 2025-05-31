import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const aadharImage = formData.get('aadharImage') as File;
    const panImage = formData.get('panImage') as File;
    const aadharNumber = formData.get('aadharNumber') as string;

    if (!aadharImage || !panImage || !aadharNumber) {
      return NextResponse.json(
        { error: "Missing required files or aadhar number" },
        { status: 400 }
      );
    }

    // Validate file types
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(aadharImage.type) || !allowedTypes.includes(panImage.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, and WebP are allowed" },
        { status: 400 }
      );
    }

    // Validate file sizes (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (aadharImage.size > maxSize || panImage.size > maxSize) {
      return NextResponse.json(
        { error: "File size too large. Maximum 5MB allowed" },
        { status: 400 }
      );
    }

    // Create uploads directory structure
    const uploadsDir = path.join(process.cwd(), 'uploads', aadharNumber);
    
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (error) {
      // Directory might already exist, that's okay
    }

    // Generate unique filenames with timestamps
    const timestamp = Date.now();
    const aadharExtension = path.extname(aadharImage.name) || '.jpg';
    const panExtension = path.extname(panImage.name) || '.jpg';
    
    const aadharFileName = `aadhar_${timestamp}${aadharExtension}`;
    const panFileName = `pan_${timestamp}${panExtension}`;
    
    const aadharFilePath = path.join(uploadsDir, aadharFileName);
    const panFilePath = path.join(uploadsDir, panFileName);

    // Convert files to buffers and save
    const aadharBytes = await aadharImage.arrayBuffer();
    const panBytes = await panImage.arrayBuffer();
    
    await writeFile(aadharFilePath, Buffer.from(aadharBytes));
    await writeFile(panFilePath, Buffer.from(panBytes));

    // Return the file paths
    const response = {
      success: true,
      message: "Files uploaded successfully",
      files: {
        aadharImage: {
          filename: aadharFileName,
          path: path.join('uploads', aadharNumber, aadharFileName),
          size: aadharImage.size
        },
        panImage: {
          filename: panFileName,
          path: path.join('uploads', aadharNumber, panFileName),
          size: panImage.size
        }
      },
      folder: aadharNumber
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Internal server error during upload" },
      { status: 500 }
    );
  }
}