# Hướng Dẫn Chạy Localhost & Đóng Gói Ứng Dụng Desktop (Electron & Tauri)

Tài liệu này hướng dẫn cách chạy ứng dụng **Rebase Overlord v0.3.5** trên máy cá nhân (localhost) và đóng gói thành một ứng dụng cài đặt hoàn chỉnh trên Windows (`.exe`), macOS (`.app`) bằng **Electron** hoặc **Tauri**.

---

## 1. Trình tự khởi chạy nhanh trên Localhost

Đầu tiên, bạn tải mã nguồn về máy cá nhân của mình, sau đó cài đặt môi trường và khởi chạy:

### Bước 1: Cài đặt các thư viện phụ thuộc
Mở Terminal/Màn hình dòng lệnh tại thư mục gốc của dự án và chạy:
```bash
npm install
```

### Bước 2: Build ứng dụng
Biên dịch cả mã nguồn Frontend (React + Vite + Tailwind 4) và bọc mã nguồn Backend (Express + Git integration) vào thư mục `dist`:
```bash
npm run build
```

### Bước 3: Khởi chạy Máy chủ Thống nhất (Express + React static)
Khởi chạy hệ thống trên cổng mặc định `3000`:
```bash
npm start
```
Bây giờ, bạn mở trình duyệt và truy cập: **`http://localhost:3000`** để sử dụng toàn bộ tính năng bao gồm khả năng chọn thư mục cục bộ của hệ điều hành!

---

## 2. Thiết lập & Chạy với Electron (Cực kỳ đơn giản)

Chúng tôi đã thiết lập sẵn luồng khởi chạy tự động Express Server bên trong nhân Electron trong tệp `electron-main.js`. Bạn chỉ cần thực hiện 2 lệnh đơn giản:

### Bước 1: Cài đặt gói Electron
Cài đặt thư viện Electron làm công cụ phát triển:
```bash
npm install electron --save-dev
```

### Bước 2: Thêm tập lệnh chạy vào mục `scripts` của `package.json`
Thêm dòng sau vào danh sách `"scripts"` của tệp `package.json` của bạn:
```json
"electron:dev": "npm run build && electron ."
```

*Khi đó, tệp `package.json` của bạn sẽ trông giống như:*
```json
"scripts": {
  "dev": "tsx server.ts",
  "build": "vite build && esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs",
  "start": "node dist/server.cjs",
  "electron:dev": "npm run build && electron .",
  "lint": "tsc --noEmit"
}
```

### Bước 3: Khởi động Electron App
```bash
npm run electron:dev
```
Cửa sổ điều khiển bản xứ của **Rebase Overlord** sẽ xuất hiện bóng bẩy!

---

## 3. Tạo file cài đặt độc lập `.exe` / `.app` (Phố biến)

Để xuất ứng dụng thành một tập tin `.exe` (hoặc `.app`/`.dmg` trên macOS/Linux), hãy làm theo các bước dưới đây:

### Bước 1: Cài đặt electron-builder
Sử dụng công cụ đóng gói chuyên nghiệp nhất:
```bash
npm install electron-builder --save-dev
```

### Bước 2: Cấu hình phân phối trong `package.json`
Bổ sung cấu hình đóng gói này vào cuối tệp `package.json` của bạn trước dấu ngoặc đóng `}` cuối cùng:
```json
"build": {
  "appId": "com.rebase.overlord",
  "productName": "Rebase Overlord",
  "directories": {
    "output": "dist-desktop"
  },
  "files": [
    "dist/**/*",
    "package.json",
    "electron-main.js"
  ],
  "win": {
    "target": "nsis"
  },
  "mac": {
    "target": "dmg"
  }
}
```

Thêm phím tắt build vào khóa `"scripts"`:
```json
"desktop:build": "npm run build && electron-builder"
```

### Bước 3: Biên dịch đóng gói thành tập tin cài đặt
Chạy tập lệnh sau:
```bash
npm run desktop:build
```
Sau khi hoàn thành, tập tin cài đặt độc lập sẽ được tạo ra sạch sẽ tại thư mục `dist-desktop/` bên dưới dự án của bạn!

---

## 4. Giải pháp thay thế nhẹ hơn với Tauri v2

Nếu bạn muốn tạo file thực thi có dung lượng nhỏ (~10MB thay vì 80MB của Electron), bạn có thể dễ dàng chuyển đổi sang **Tauri**:

1. Cài đặt các thư viện tauri CLI:
   ```bash
   npm install @tauri-apps/cli --save-dev
   ```
2. Khởi tạo Tauri tại thư mục hiện tại:
   ```bash
   npx tauri init
   ```
   - Nhập đường dẫn build ứng dụng: `../dist`
   - Nhập URL máy chủ dev: `http://localhost:3000`
3. Kích hoạt tính năng **Sidecar** trong tệp cấu hình của Tauri để Express Server chạy song song tuyệt đối cùng Nhân giao diện Tauri, nâng tốc độ tải lên tối đa.

Sự linh hoạt trong kiến trúc API Resolver của chúng tôi (`/src/utils/apiResolver.ts`) sẽ định tuyến các lời gọi dịch vụ chính xác tới cổng cục bộ `http://localhost:3000` bất kể nó được hiển thị từ `tauri://localhost` hay `file://`! Cho phép trải nghiệm ổn định và đồng nhất.
