// Copyright 2017 The Draco Authors.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
const draco3d = require('draco3d');
const assert = require('assert');

export default class DracoDecompressor {
  constructor() {
    this.decoderModule = draco3d.createDecoderModule({});
    const {Decoder} = this.decodeModule;
    this.decoder = new Decoder();
  }

  destroy() {
    this.decoderModule.destroy(decoder);
  }

  destroyDecodedObject(object) {
    if (object) {
      this.decoderModule.destroy(decodedGeometry);
    }
  }

  // NOTE: caller must call `destroyDecodedObject` on the return value after using it
  decodeDracoData(arrayBuffer) {
    const buffer = new this.decoderModule.DecoderBuffer();
    buffer.Init(new Int8Array(arrayBuffer), arrayBuffer.byteLength);

    let dracoGeometry;

    try {
      const geometryType = decoder.GetEncodedGeometryType(buffer);
      switch (geometryType) {

      case this.decoderModule.TRIANGULAR_MESH:
        dracoGeometry = new this.decoderModule.Mesh();
        const status = decoder.DecodeBufferToMesh(buffer, dracoGeometry);
        break;

      case this.decoderModule.POINT_CLOUD:
        dracoGeometry = new this.decoderModule.PointCloud();
        const status = decoder.DecodeBufferToPointCloud(buffer, dracoGeometry);
        break;

      default:
        throw new Error('Unknown draco geometry type.');
      }
    } finally {
      this.decoderModule.destroy(buffer);
    }

    return dracoGeometry;
  }

  encodeMesh(mesh, decoder) {
    const encoder = new this.encoderModule.Encoder();
    const meshBuilder = new this.encoderModule.MeshBuilder();

    // Create a mesh object for storing mesh data.
    const newMesh = new this.encoderModule.Mesh();

    const numFaces = mesh.num_faces();
    const numIndices = numFaces * 3;
    const numPoints = mesh.num_points();
    const indices = new Uint32Array(numIndices);

    console.log("Number of faces " + numFaces);
    console.log("Number of vertices " + numPoints);

    // Add Faces to mesh
    const ia = new this.decoderModule.DracoInt32Array();
    for (let i = 0; i < numFaces; ++i) {
      decoder.GetFaceFromMesh(mesh, i, ia);
      const index = i * 3;
      indices[index] = ia.GetValue(0);
      indices[index + 1] = ia.GetValue(1);
      indices[index + 2] = ia.GetValue(2);
    }
    this.decoderModule.destroy(ia);
    meshBuilder.AddFacesToMesh(newMesh, numFaces, indices);

    const attrs = {POSITION: 3, NORMAL: 3, COLOR: 3, TEX_COORD: 2};

    Object.keys(attrs).forEach((attr) => {
      const stride = attrs[attr];
      const numValues = numPoints * stride;
      const decoderAttr = this.decoderModule[attr];
      const encoderAttr = this.encoderModule[attr];
      const attrId = decoder.GetAttributeId(mesh, decoderAttr);

      if (attrId < 0) {
        return;
      }

      console.log("Adding %s attribute", attr);

      const attribute = decoder.GetAttribute(mesh, attrId);
      const attributeData = new this.decoderModule.DracoFloat32Array();
      decoder.GetAttributeFloatForAllPoints(mesh, attribute, attributeData);

      assert(numValues === attributeData.size(), 'Wrong attribute size.');

      const attributeDataArray = new Float32Array(numValues);
      for (let i = 0; i < numValues; ++i) {
        attributeDataArray[i] = attributeData.GetValue(i);
      }

      this.decoderModule.destroy(attributeData);
      meshBuilder.AddFloatAttributeToMesh(newMesh, encoderAttr, numPoints,
          stride, attributeDataArray);
    });

    let encodedData = new this.encoderModule.DracoInt8Array();
    // Set encoding options.
    encoder.SetSpeedOptions(5, 5);
    encoder.SetAttributeQuantization(this.encoderModule.POSITION, 10);
    encoder.SetEncodingMethod(this.encoderModule.MESH_EDGEBREAKER_ENCODING);

    // Encoding.
    console.log("Encoding...");
    const encodedLen = encoder.EncodeMeshToDracoBuffer(newMesh,
                                                       encodedData);
    this.encoderModule.destroy(newMesh);

    if (encodedLen > 0) {
      console.log("Encoded size is " + encodedLen);
    } else {
      console.log("Error: Encoding failed.");
    }
    // Copy encoded data to buffer.
    const outputBuffer = new ArrayBuffer(encodedLen);
    const outputData = new Int8Array(outputBuffer);
    for (let i = 0; i < encodedLen; ++i) {
      outputData[i] = encodedData.GetValue(i);
    }

    this.encoderModule.destroy(encodedData);
    this.encoderModule.destroy(encoder);
    this.encoderModule.destroy(meshBuilder);

    return outputData;
  }
}
