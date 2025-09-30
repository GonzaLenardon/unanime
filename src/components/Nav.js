/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Reloj } from '../common/Reloj';
/* import logo from '../assets/granjaChelita.png'; */
import home from '../assets/home.png';

import { useAuth } from '../context/AuthContext';

import axios from 'axios';

export const Nav = () => {
  const navigate = useNavigate();
  const url = process.env.REACT_APP_API_URL;

  const { userLogout, user, isAdmin } = useAuth();

  const logout = async () => {
    try {
      await axios.post(`${url}/user/logout`, {}, { withCredentials: true }); // 👈 importante
      userLogout();

      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const handleNavLinkClick = () => {
    const navbarCollapse = document.getElementById('navbarNavAltMarkup');
    if (navbarCollapse.classList.contains('show')) {
      const bsCollapse = new window.bootstrap.Collapse(navbarCollapse, {
        toggle: true,
      });
      bsCollapse.hide();
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg rounded-3 myNavBar">
        <div className="container-fluid px-3 px-md-5">
          <Link className="navbar-brand" to="/home">
            {/* <h3 className="appTitulo">Amore Infinito</h3> */}

            <img className="logo" src={home} alt="home" />
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavAltMarkup"
            aria-controls="navbarNavAltMarkup"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav me-auto fs-4 fw-bold">
              <Link
                className="nav-link "
                to="/productos"
                onClick={handleNavLinkClick}
              >
                Productos
              </Link>
              {isAdmin && (
                <Link
                  className="nav-link"
                  to="/proveedores"
                  onClick={handleNavLinkClick}
                >
                  Proveedores
                </Link>
              )}
              <Link
                className="nav-link"
                to="/ventas"
                onClick={handleNavLinkClick}
              >
                Ventas
              </Link>
              {isAdmin && (
                <Link
                  className="nav-link"
                  to="/compras"
                  translate="no"
                  onClick={handleNavLinkClick}
                >
                  Stock
                </Link>
              )}
              {isAdmin && (
                <Link
                  className="nav-link"
                  to="/gastos"
                  translate="no"
                  onClick={handleNavLinkClick}
                >
                  Gastos
                </Link>
              )}

              <Link
                className="nav-link"
                to="/cambios"
                translate="no"
                onClick={handleNavLinkClick}
              >
                Cambios
              </Link>

              {isAdmin && (
                <ul className="nav px-2">
                  <li className="nav-item dropdown">
                    <a
                      className="nav-link dropdown-toggle"
                      id="myLinka"
                      data-bs-toggle="dropdown"
                      href="#"
                      role="button"
                      aria-expanded="false"
                    >
                      Tipos
                    </a>
                    <ul className="dropdown-menu">
                      <li>
                        <Link
                          className="dropdown-item"
                          to="/tipoventas"
                          translate="no"
                          onClick={handleNavLinkClick}
                        >
                          Ventas
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item"
                          to="/gastos/tipos"
                          translate="no"
                          onClick={handleNavLinkClick}
                        >
                          Gastos
                        </Link>
                      </li>

                      <li>
                        <Link
                          className="dropdown-item"
                          to="/usuarios"
                          translate="no"
                          onClick={handleNavLinkClick}
                        >
                          Usuarios
                        </Link>
                      </li>
                    </ul>
                  </li>
                </ul>
              )}
              <ul className="nav px-2">
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    id="myLinka"
                    data-bs-toggle="dropdown"
                    href="#"
                    role="button"
                    aria-expanded="false"
                  >
                    Listados
                  </a>
                  <ul className="dropdown-menu">
                    {isAdmin && (
                      <>
                        <li>
                          <Link
                            className="dropdown-item"
                            to="/listado/compra"
                            onClick={handleNavLinkClick}
                          >
                            Compras
                          </Link>
                        </li>

                        <li>
                          <Link
                            className="dropdown-item"
                            to="/listado/gastos"
                            onClick={handleNavLinkClick}
                          >
                            Gastos
                          </Link>
                        </li>

                        <li>
                          <Link
                            className="dropdown-item"
                            to="/listado/producto"
                            onClick={handleNavLinkClick}
                          >
                            Productos
                          </Link>
                        </li>

                        <li>
                          <Link
                            className="dropdown-item"
                            to="/listado/ventas/sucursales"
                            onClick={handleNavLinkClick}
                          >
                            Ventas Sucursales
                          </Link>
                        </li>
                      </>
                    )}
                    <li>
                      <Link
                        className="dropdown-item"
                        to="/listado/venta"
                        onClick={handleNavLinkClick}
                      >
                        Ventas Totales
                      </Link>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>

            <Reloj />
            <div className="dropdown">
              <button
                className="btn btn-primary dropdown-toggle"
                type="button"
                id="dropdownMenuButton1"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {user?.nombre}
              </button>
              <ul
                className="dropdown-menu responsive-dropdown"
                aria-labelledby="dropdownMenuButton1"
              >
                <li>
                  <button className="dropdown-item" onClick={logout}>
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};
