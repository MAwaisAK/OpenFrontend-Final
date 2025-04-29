import Sidebar from "../Admin_Sidebar";
import Navbar from "../Admin_Nav";
import Image from "next/image";

import Resources from "../Admin_Scripts"
const Profile = () => {
  return (
    <>
    <Resources/>
    <div id="app">
    <div className="main-wrapper main-wrapper-1">
      <div className="navbar-bg"></div>
      <Navbar/>
      <Sidebar/>
      <div className="main-content">
  <section className="section">
    <div className="section-body">
      <div className="row mt-sm-4">
        <div className="col-12 col-md-12 col-lg-4">
          <div className="card author-box">
            <div className="card-body">
              <div className="author-box-center">
                <img
                  alt="image"
                  src="/assets/admin_assets/img/users/user-1.png"
                  className="rounded-circle author-box-picture"
                />
                <div className="clearfix" />
                <div className="author-box-name">
                  <a href="#">Sarah Smith</a>
                </div>
                <div className="author-box-job">Web Developer</div>
              </div>
              <div className="text-center">
                <div className="author-box-description">
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Pariatur voluptatum alias molestias minus quod dignissimos.
                  </p>
                </div>
                <div className="mb-2 mt-3">
                  <div className="text-small font-weight-bold">
                    Follow Hasan On
                  </div>
                </div>
                <a href="#" className="btn btn-social-icon mr-1 btn-facebook">
                  <i className="fab fa-facebook-f" />
                </a>
                <a href="#" className="btn btn-social-icon mr-1 btn-twitter">
                  <i className="fab fa-twitter" />
                </a>
                <a href="#" className="btn btn-social-icon mr-1 btn-github">
                  <i className="fab fa-github" />
                </a>
                <a href="#" className="btn btn-social-icon mr-1 btn-instagram">
                  <i className="fab fa-instagram" />
                </a>
                <div className="w-100 d-sm-none" />
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-header">
              <h4>Personal Details</h4>
            </div>
            <div className="card-body">
              <div className="py-4">
                <p className="clearfix">
                  <span className="float-left">Birthday</span>
                  <span className="float-right text-muted">30-05-1998</span>
                </p>
                <p className="clearfix">
                  <span className="float-left">Phone</span>
                  <span className="float-right text-muted">
                    (0123)123456789
                  </span>
                </p>
                <p className="clearfix">
                  <span className="float-left">Mail</span>
                  <span className="float-right text-muted">
                    test@example.com
                  </span>
                </p>
                <p className="clearfix">
                  <span className="float-left">Facebook</span>
                  <span className="float-right text-muted">
                    <a href="#">John Deo</a>
                  </span>
                </p>
                <p className="clearfix">
                  <span className="float-left">Twitter</span>
                  <span className="float-right text-muted">
                    <a href="#">@johndeo</a>
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-header">
              <h4>Skills</h4>
            </div>
            <div className="card-body">
              <ul className="list-unstyled user-progress list-unstyled-border list-unstyled-noborder">
                <li className="media">
                  <div className="media-body">
                    <div className="media-title">Java</div>
                  </div>
                  <div className="media-progressbar p-t-10">
                    <div className="progress" data-height={6}>
                      <div
                        className="progress-bar bg-primary"
                        data-width="70%"
                      />
                    </div>
                  </div>
                </li>
                <li className="media">
                  <div className="media-body">
                    <div className="media-title">Web Design</div>
                  </div>
                  <div className="media-progressbar p-t-10">
                    <div className="progress" data-height={6}>
                      <div
                        className="progress-bar bg-warning"
                        data-width="80%"
                      />
                    </div>
                  </div>
                </li>
                <li className="media">
                  <div className="media-body">
                    <div className="media-title">Photoshop</div>
                  </div>
                  <div className="media-progressbar p-t-10">
                    <div className="progress" data-height={6}>
                      <div className="progress-bar bg-green" data-width="48%" />
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-12 col-lg-8">
          <div className="card">
            <div className="padding-20">
              <ul className="nav nav-tabs" id="myTab2" role="tablist">
                <li className="nav-item">
                  <a
                    className="nav-link active"
                    id="home-tab2"
                    data-toggle="tab"
                    href="#about"
                    role="tab"
                    aria-selected="true"
                  >
                    About
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    id="profile-tab2"
                    data-toggle="tab"
                    href="#settings"
                    role="tab"
                    aria-selected="false"
                  >
                    Joined Tribes
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    id="profile-tab2"
                    data-toggle="tab"
                    href="#settings"
                    role="tab"
                    aria-selected="false"
                  >
                    Setting
                  </a>
                </li>
              </ul>
              <div className="tab-content tab-bordered" id="myTab3Content">
                <div
                  className="tab-pane fade show active"
                  id="about"
                  role="tabpanel"
                  aria-labelledby="home-tab2"
                >
                  <div className="row">
                    <div className="col-md-3 col-6 b-r">
                      <strong>Full Name</strong>
                      <br />
                      <p className="text-muted">Emily Smith</p>
                    </div>
                    <div className="col-md-3 col-6 b-r">
                      <strong>Mobile</strong>
                      <br />
                      <p className="text-muted">(92) 1456 7823490</p>
                    </div>
                    <div className="col-md-3 col-6 b-r">
                      <strong>Email</strong>
                      <br />
                      <p className="text-muted">johndeo@example.com</p>
                    </div>
                    <div className="col-md-3 col-6">
                      <strong>Location</strong>
                      <br />
                      <p className="text-muted">Pakistan</p>
                    </div>
                  </div>
                  <p className="m-t-30">
                    Completed my graduation in Arts from the well known and
                    renowned institution of Pakistan – Punjab ARTS COLLEGE,
                    Punjab in 2000-01, which was affiliated to NUST University.
                    I ranker in University exams from the same university from
                    1996-01.
                  </p>
                  <p>
                    Worked as Professor and Head of the department at Punjab
                    Collage, Islamabad, Islamabad from 2003-2015{" "}
                  </p>
                  <p>
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's
                    standard dummy text ever since the 1500s, when an unknown
                    printer took a galley of type and scrambled it to make a
                    type specimen book. It has survived not only five centuries,
                    but also the leap into electronic typesetting, remaining
                    essentially unchanged.
                  </p>
                  <div className="section-title">Education</div>
                  <ul>
                    <li>B.A.,Gujarat University, Ahmedabad,India.</li>
                    <li>M.A.,Gujarat University, Ahmedabad, India.</li>
                    <li>P.H.D., Shaurashtra University, Rajkot</li>
                  </ul>
                  <div className="section-title">Experience</div>
                  <ul>
                    <li>
                      One year experience as Jr. Professor from April-2009 to
                      march-2010 at B. J. Arts College, Islamabad.
                    </li>
                    <li>
                      Three year experience as Jr. Professor at V.S. Arts &amp;
                      Commerse Collage from April - 2008 to April - 2011.
                    </li>
                    <li>
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry.
                    </li>
                    <li>
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry.
                    </li>
                    <li>
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry.
                    </li>
                    <li>
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry.
                    </li>
                  </ul>
                </div>
                <div
                  className="tab-pane fade"
                  id="settings"
                  role="tabpanel"
                  aria-labelledby="profile-tab2"
                >
                  <form method="post" className="needs-validation">
                    <div className="card-header">
                      <h4>Edit Profile</h4>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="form-group col-md-6 col-12">
                          <label>First Name</label>
                          <input
                            type="text"
                            className="form-control"
                            defaultValue="John"
                          />
                          <div className="invalid-feedback">
                            Please fill in the first name
                          </div>
                        </div>
                        <div className="form-group col-md-6 col-12">
                          <label>Last Name</label>
                          <input
                            type="text"
                            className="form-control"
                            defaultValue="Deo"
                          />
                          <div className="invalid-feedback">
                            Please fill in the last name
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="form-group col-md-7 col-12">
                          <label>Email</label>
                          <input
                            type="email"
                            className="form-control"
                            defaultValue="test@example.com"
                          />
                          <div className="invalid-feedback">
                            Please fill in the email
                          </div>
                        </div>
                        <div className="form-group col-md-5 col-12">
                          <label>Phone</label>
                          <input
                            type="tel"
                            className="form-control"
                            defaultValue=""
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="form-group col-12">
                          <label>Bio</label>
                          <textarea
                            className="form-control summernote-simple"
                            defaultValue={
                              "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Pariatur voluptatum alias molestias minus quod dignissimos."
                            }
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="form-group mb-0 col-12">
                          <div className="custom-control custom-checkbox">
                            <input
                              type="checkbox"
                              name="remember"
                              className="custom-control-input"
                              id="newsletter"
                            />
                            <label
                              className="custom-control-label"
                              htmlFor="newsletter"
                            >
                              Subscribe to newsletter
                            </label>
                            <div className="text-muted form-text">
                              You will get new information about products,
                              offers and promotions
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card-footer text-right">
                      <button className="btn btn-primary">Save Changes</button>
                    </div>
                  </form>
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

export default Profile;