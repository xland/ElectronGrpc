#include <napi.h>
#include <windows.h>
#include <windowsx.h>

LRESULT CALLBACK wndProc(HWND hwnd, UINT msg, WPARAM wparam, LPARAM lparam) {
    switch (msg) {
        case WM_NCCALCSIZE: {
            return 0;
        }
        case WM_LBUTTONDOWN:{
            MessageBox(hwnd,
					"allen",
					"allen",
					MB_ICONWARNING | MB_OK);
            return 0;
        }
    }
    return DefWindowProcW(hwnd, msg, wparam, lparam);
}
void CreateChildWindow(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();
    Napi::Buffer<void *> wndHandle = info[0].As<Napi::Buffer<void *>>();
    HWND hwndParent = static_cast<HWND>(*reinterpret_cast<void **>(wndHandle.Data()));
    HWND hwndD3D = FindWindowEx(hwndParent, nullptr, "Intermediate D3D Window", nullptr);
    LONG_PTR style = GetWindowLongPtr(hwndD3D, GWL_STYLE);
    if ((style & WS_CLIPSIBLINGS) == 0) {
        style |= WS_CLIPSIBLINGS;
        SetWindowLongPtr(hwndD3D, GWL_STYLE, style);
    }
    style = GetWindowLongPtr(hwndParent, GWL_STYLE);
    if ((style & WS_CLIPCHILDREN) == 0) {
        style |= WS_CLIPCHILDREN;
        SetWindowLongPtr(hwndParent, GWL_STYLE, style);
    }
    WNDCLASSEXW wcx{};
    wcx.cbSize = sizeof(wcx);
    wcx.style = CS_HREDRAW | CS_VREDRAW;
    wcx.hInstance = nullptr;
    wcx.lpfnWndProc = &wndProc;
    wcx.lpszClassName = L"ChildWindowClass";
    wcx.hbrBackground = CreateSolidBrush(RGB(226, 160, 160));
    wcx.hCursor = LoadCursor(nullptr, IDC_ARROW);
    ATOM childClassId = RegisterClassExW(&wcx);
    if (!childClassId)
    {
        auto errCode = GetLastError();
    }
    auto borderlessStyle = WS_CHILD| WS_POPUP | WS_VISIBLE;
    HWND hwnd = CreateWindowExW(0, wcx.lpszClassName, NULL, borderlessStyle, 100, 100, 600, 600, nullptr, nullptr, nullptr, nullptr);
    SetParent(hwnd, hwndParent);
}
Napi::Object Init(Napi::Env env, Napi::Object exports)
{
    exports.Set(Napi::String::New(env, "createChildWindow"), Napi::Function::New(env, CreateChildWindow));
    return exports;
}
NODE_API_MODULE(NODE_GYP_MODULE_NAME, Init)