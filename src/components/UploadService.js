import axios from "axios";

class UploadService {
  async upload(img, type) {
    let imgData = new FormData();

    const parts = img[0].split(';');
    const name = parts[1].split('=')[1];

    imgData.append("img", img);
    axios('/api/', imgData).then((res) => {
        console.log(res)
        return res
    }, (error) => {
      console.log(error)
    })
  }

  // getImages() {
  //   return http.get("/img");
  // }
}

export default new UploadService();