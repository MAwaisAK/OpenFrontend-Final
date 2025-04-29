import Sidebar from "../Admin_Sidebar";
import Navbar from "../Admin_Nav";
import Resources from "../Admin_Scripts"
import '../../styles/admin_assets/bundles/summernote/summernote-bs4.css';
import '../../styles/admin_assets/bundles/bootstrap-tagsinput/dist/bootstrap-tagsinput.css';
import Script from 'next/script';
const Tools = () => {
  return (
    <>
    <Resources/>
    <Script src="/assets/admin_assets/bundles/jquery-selectric/jquery.selectric.min.js" strategy="beforeInteractive"></Script>
    <Script src="/assets/admin_assets/bundles/upload-preview/assets/js/jquery.uploadPreview.min.js" strategy="beforeInteractive"></Script>
    <Script src="/assets/admin_assets/bundles/summernote/summernote-bs4.js" strategy="beforeInteractive"></Script>
    <Script src="/assets/admin_assets/bundles/bootstrap-tagsinput/dist/bootstrap-tagsinput.min.js" strategy="beforeInteractive"></Script>
    <Script src="/assets/admin_assets/js/page/create-post.js" strategy="beforeInteractive"></Script>
    <div id="app">
    <div className="main-wrapper main-wrapper-1">
      <div className="navbar-bg"></div>
      <Navbar/>
      <Sidebar/>
      <div className="main-content">
  <section className="section">
    <div className="section-body">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h4>Change Logo</h4>
            </div>
            <div className="card-body">
              <div className="form-group row mb-4">
                <label className="col-form-label text-md-right col-12 col-md-3 col-lg-3">
                  Logo Header
                </label>
                <div className="col-sm-12 col-md-7">
                  <div id="image-preview" className="image-preview">
                    <label htmlFor="image-upload" id="image-label">
                      Choose File
                    </label>
                    <input type="file" name="image" id="image-upload" />
                  </div>
                </div>
              </div>
              <div className="form-group row mb-4">
                <label className="col-form-label text-md-right col-12 col-md-3 col-lg-3">
                  Logo Footer
                </label>
                <div className="col-sm-12 col-md-7">
                  <div id="image-preview" className="image-preview">
                    <label htmlFor="image-upload" id="image-label">
                      Choose File
                    </label>
                    <input type="file" name="image" id="image-upload" />
                  </div>
                </div>
              </div>
              <div className="form-group row mb-4">
                <label className="col-form-label text-md-right col-12 col-md-3 col-lg-3" />
                <div className="col-sm-12 col-md-7">
                  <button className="btn btn-primary">Update</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <div className="settingSidebar">
    <a href="javascript:void(0)" className="settingPanelToggle">
      {" "}
      <i className="fa fa-spin fa-cog" />
    </a>
    <div className="settingSidebar-body ps-container ps-theme-default">
      <div className=" fade show active">
        <div className="setting-panel-header">Setting Panel</div>
        <div className="p-15 border-bottom">
          <h6 className="font-medium m-b-10">Select Layout</h6>
          <div className="selectgroup layout-color w-50">
            <label className="selectgroup-item">
              <input
                type="radio"
                name="value"
                defaultValue={1}
                className="selectgroup-input-radio select-layout"
                defaultChecked=""
              />
              <span className="selectgroup-button">Light</span>
            </label>
            <label className="selectgroup-item">
              <input
                type="radio"
                name="value"
                defaultValue={2}
                className="selectgroup-input-radio select-layout"
              />
              <span className="selectgroup-button">Dark</span>
            </label>
          </div>
        </div>
        <div className="p-15 border-bottom">
          <h6 className="font-medium m-b-10">Sidebar Color</h6>
          <div className="selectgroup selectgroup-pills sidebar-color">
            <label className="selectgroup-item">
              <input
                type="radio"
                name="icon-input"
                defaultValue={1}
                className="selectgroup-input select-sidebar"
              />
              <span
                className="selectgroup-button selectgroup-button-icon"
                data-toggle="tooltip"
                data-original-title="Light Sidebar"
              >
                <i className="fas fa-sun" />
              </span>
            </label>
            <label className="selectgroup-item">
              <input
                type="radio"
                name="icon-input"
                defaultValue={2}
                className="selectgroup-input select-sidebar"
                defaultChecked=""
              />
              <span
                className="selectgroup-button selectgroup-button-icon"
                data-toggle="tooltip"
                data-original-title="Dark Sidebar"
              >
                <i className="fas fa-moon" />
              </span>
            </label>
          </div>
        </div>
        <div className="p-15 border-bottom">
          <h6 className="font-medium m-b-10">Color Theme</h6>
          <div className="theme-setting-options">
            <ul className="choose-theme list-unstyled mb-0">
              <li title="white" className="active">
                <div className="white" />
              </li>
              <li title="cyan">
                <div className="cyan" />
              </li>
              <li title="black">
                <div className="black" />
              </li>
              <li title="purple">
                <div className="purple" />
              </li>
              <li title="orange">
                <div className="orange" />
              </li>
              <li title="green">
                <div className="green" />
              </li>
              <li title="red">
                <div className="red" />
              </li>
            </ul>
          </div>
        </div>
        <div className="p-15 border-bottom">
          <div className="theme-setting-options">
            <label className="m-b-0">
              <input
                type="checkbox"
                name="custom-switch-checkbox"
                className="custom-switch-input"
                id="mini_sidebar_setting"
              />
              <span className="custom-switch-indicator" />
              <span className="control-label p-l-10">Mini Sidebar</span>
            </label>
          </div>
        </div>
        <div className="p-15 border-bottom">
          <div className="theme-setting-options">
            <label className="m-b-0">
              <input
                type="checkbox"
                name="custom-switch-checkbox"
                className="custom-switch-input"
                id="sticky_header_setting"
              />
              <span className="custom-switch-indicator" />
              <span className="control-label p-l-10">Sticky Header</span>
            </label>
          </div>
        </div>
        <div className="mt-4 mb-4 p-3 align-center rt-sidebar-last-ele">
          <a
            href="#"
            className="btn btn-icon icon-left btn-primary btn-restore-theme"
          >
            <i className="fas fa-undo" /> Restore Default
          </a>
        </div>
      </div>
    </div>
  </div>
</div>



    </div>
    </div>
      </>
  );
};

export default Tools;