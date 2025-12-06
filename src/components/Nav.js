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

  const isAdmin = localStorage.getItem('admin');
  const usuario = localStorage.getItem('Usuario');

  const { userLogout } = useAuth();

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

  const id_sucursal = localStorage.getItem('sucursal_id');

  // Definir estilos según sucursal
  const estilos =
    id_sucursal === '1'
      ? {
          // SUCURSAL 1: Estilo Masculino (Púrpura-Azul)
          gradiente: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          colorPrincipal: '#667eea',
          colorSecundario: '#764ba2',
          textoHover: '#667eea',
          nombreTienda: 'Unanime Man',
        }
      : {
          // SUCURSAL 2: Estilo Femenino (Rosa-Coral)
          gradiente: 'linear-gradient(135deg, #f857a6 0%, #ff5858 100%)',
          colorPrincipal: '#f857a6',
          colorSecundario: '#ff5858',
          textoHover: '#f857a6',
          nombreTienda: 'Unanime Woman',
        };

  return (
    <>
      <nav
        className="navbar navbar-expand-lg rounded-4 shadow-lg mb-3 d-flex"
        style={{
          background: estilos.gradiente,
          padding: '1rem 0',
          border: '2px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        <div className="container-fluid px-3 px-md-5">
          {/* Logo/Brand */}
          <Link className="navbar-brand" to="/home">
            <div
              className="d-flex align-items-center gap-3 px-4 py-2"
              style={{
                background: 'white',
                borderRadius: '50px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
              }}
            >
              <img
                className="logo"
                src={home}
                alt="home"
                style={{
                  width: '40px',
                  height: '40px',
                }}
              />
              <span
                className="fw-bold d-none d-md-inline"
                style={{
                  background: estilos.gradiente,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: '1.3rem',
                }}
              >
                {estilos.nombreTienda}
              </span>
            </div>
          </Link>

          {/* Toggler */}
          <button
            className="navbar-toggler border-0 shadow-sm"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavAltMarkup"
            style={{
              backgroundColor: 'white',
              borderRadius: '10px',
            }}
          >
            <i
              className="bi bi-list"
              style={{ color: estilos.colorPrincipal, fontSize: '1.5rem' }}
            ></i>
          </button>

          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            {/* Links principales */}
            <div className="navbar-nav me-auto gap-1 mt-3 mt-lg-0 align-items-lg-center">
              {/* Separador */}
              <div
                className="d-none d-lg-block mx-2"
                style={{
                  width: '2px',
                  height: '30px',
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                }}
              ></div>

              <Link
                className="nav-link text-white px-4 py-2 custom-nav-link"
                to="/productos"
                onClick={handleNavLinkClick}
                style={{ '--texto-hover': estilos.textoHover }}
              >
                <i className="bi bi-box-seam me-2"></i>
                Productos
              </Link>

              {isAdmin && (
                <Link
                  className="nav-link text-white px-4 py-2 custom-nav-link"
                  to="/proveedores"
                  onClick={handleNavLinkClick}
                  style={{ '--texto-hover': estilos.textoHover }}
                >
                  <i className="bi bi-truck me-2"></i>
                  Proveedores
                </Link>
              )}

              <Link
                className="nav-link text-white px-4 py-2 custom-nav-link"
                to="/ventas"
                onClick={handleNavLinkClick}
                style={{ '--texto-hover': estilos.textoHover }}
              >
                <i className="bi bi-cart-check me-2"></i>
                Ventas
              </Link>

              {isAdmin && (
                <>
                  <Link
                    className="nav-link text-white px-4 py-2 custom-nav-link"
                    to="/compras"
                    onClick={handleNavLinkClick}
                    style={{ '--texto-hover': estilos.textoHover }}
                  >
                    <i className="bi bi-boxes me-2"></i>
                    Stock
                  </Link>

                  <Link
                    className="nav-link text-white px-4 py-2 custom-nav-link"
                    to="/gastos"
                    onClick={handleNavLinkClick}
                    style={{ '--texto-hover': estilos.textoHover }}
                  >
                    <i className="bi bi-receipt me-2"></i>
                    Gastos
                  </Link>
                </>
              )}

              <Link
                className="nav-link text-white px-4 py-2 custom-nav-link"
                to="/cambios"
                onClick={handleNavLinkClick}
                style={{ '--texto-hover': estilos.textoHover }}
              >
                <i className="bi bi-arrow-left-right me-2"></i>
                Cambios
              </Link>

              {/* Separador */}
              <div
                className="d-none d-lg-block mx-2"
                style={{
                  width: '2px',
                  height: '30px',
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                }}
              ></div>

              {/* Dropdown Tipos */}
              {isAdmin && (
                <div className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle text-white px-4 py-2 d-flex align-items-center gap-2"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    style={{
                      transition: 'all 0.3s ease',
                      borderRadius: '12px',
                      fontWeight: '600',
                    }}
                  >
                    <i className="bi bi-gear"></i>
                    Tipos
                    <span
                      className="badge bg-white"
                      style={{
                        fontSize: '0.7rem',
                        borderRadius: '8px',
                        color: estilos.colorPrincipal,
                      }}
                    >
                      3
                    </span>
                  </a>

                  <ul
                    className="dropdown-menu border-0 shadow-lg mt-2"
                    style={{ borderRadius: '15px' }}
                  >
                    <li>
                      <Link
                        className="dropdown-item py-2 px-4"
                        to="/tipoventas"
                        onClick={handleNavLinkClick}
                        style={{
                          transition: 'all 0.2s ease',
                          borderRadius: '10px',
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = `${estilos.colorPrincipal}15`;
                          e.target.style.color = estilos.colorPrincipal;
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'transparent';
                          e.target.style.color = 'inherit';
                        }}
                      >
                        <i
                          className="bi bi-tag me-2"
                          style={{ color: estilos.colorPrincipal }}
                        ></i>
                        <span className="fw-semibold">Ventas</span>
                      </Link>
                    </li>

                    <li>
                      <hr className="dropdown-divider" />
                    </li>

                    {/* ✅ CORRECCIÓN: Cambiar nav-link por dropdown-item */}
                    <li>
                      <Link
                        className="dropdown-item py-2 px-4"
                        to="/gastos/tipos"
                        onClick={handleNavLinkClick}
                        style={{
                          transition: 'all 0.2s ease',
                          borderRadius: '10px',
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#ffc10715';
                          e.target.style.color = '#ffc107';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'transparent';
                          e.target.style.color = 'inherit';
                        }}
                      >
                        <i className="bi bi-cash-stack me-2 text-warning"></i>
                        <span className="fw-semibold">Gastos</span>
                      </Link>
                    </li>

                    <li>
                      <hr className="dropdown-divider" />
                    </li>

                    <li>
                      <Link
                        className="dropdown-item py-2 px-4"
                        to="/usuarios"
                        onClick={handleNavLinkClick}
                        style={{
                          transition: 'all 0.2s ease',
                          borderRadius: '10px',
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#0dcaf015';
                          e.target.style.color = '#0dcaf0';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'transparent';
                          e.target.style.color = 'inherit';
                        }}
                      >
                        <i className="bi bi-people me-2 text-info"></i>
                        <span className="fw-semibold">Usuarios</span>
                      </Link>
                    </li>
                  </ul>
                </div>
              )}

              {/* Dropdown Listados */}
              <div className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle text-white px-4 py-2 d-flex align-items-center gap-2"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  style={{
                    transition: 'all 0.3s ease',
                    borderRadius: '12px',
                    fontWeight: '600',
                  }}
                >
                  <i className="bi bi-list-ul me-2"></i>
                  Listados
                  {/* ✅ CORRECCIÓN: Agregar badge con número 4 */}
                  <span
                    className="badge bg-white"
                    style={{
                      fontSize: '0.7rem',
                      borderRadius: '8px',
                      color: estilos.colorPrincipal,
                    }}
                  >
                    {isAdmin ? '4' : '1'}
                  </span>
                </a>

                <ul
                  className="dropdown-menu border-0 shadow-lg mt-2"
                  style={{ borderRadius: '15px' }}
                >
                  {isAdmin && (
                    <>
                      <li>
                        <Link
                          className="dropdown-item py-2 px-4"
                          to="/listado/compra"
                          onClick={handleNavLinkClick}
                          style={{
                            transition: 'all 0.2s ease',
                            borderRadius: '10px',
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#19875415';
                            e.target.style.color = '#198754';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'transparent';
                            e.target.style.color = 'inherit';
                          }}
                        >
                          <i className="bi bi-clipboard-data me-2 text-success"></i>
                          <span className="fw-semibold">Compras</span>
                        </Link>
                      </li>

                      <li>
                        <hr className="dropdown-divider" />
                      </li>

                      <li>
                        <Link
                          className="dropdown-item py-2 px-4"
                          to="/listado/gastos"
                          onClick={handleNavLinkClick}
                          style={{
                            transition: 'all 0.2s ease',
                            borderRadius: '10px',
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#dc354515';
                            e.target.style.color = '#dc3545';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'transparent';
                            e.target.style.color = 'inherit';
                          }}
                        >
                          <i className="bi bi-wallet2 me-2 text-danger"></i>
                          <span className="fw-semibold">Gastos</span>
                        </Link>
                      </li>

                      <li>
                        <hr className="dropdown-divider" />
                      </li>

                      <li>
                        <Link
                          className="dropdown-item py-2 px-4"
                          to="/listado/producto"
                          onClick={handleNavLinkClick}
                          style={{
                            transition: 'all 0.2s ease',
                            borderRadius: '10px',
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = `${estilos.colorPrincipal}15`;
                            e.target.style.color = estilos.colorPrincipal;
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'transparent';
                            e.target.style.color = 'inherit';
                          }}
                        >
                          <i
                            className="bi bi-box me-2"
                            style={{ color: estilos.colorPrincipal }}
                          ></i>
                          <span className="fw-semibold">Productos</span>
                        </Link>
                      </li>

                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                    </>
                  )}

                  <li>
                    <Link
                      className="dropdown-item py-2 px-4"
                      to="/listado/venta"
                      onClick={handleNavLinkClick}
                      style={{
                        transition: 'all 0.2s ease',
                        borderRadius: '10px',
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#0dcaf015';
                        e.target.style.color = '#0dcaf0';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                        e.target.style.color = 'inherit';
                      }}
                    >
                      <i className="bi bi-graph-up me-2 text-info"></i>
                      <span className="fw-semibold">Ventas Totales</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Sección derecha */}
            <div className="d-flex align-items-center gap-3 mt-3 mt-lg-0">
              {/* Reloj */}
              <div
                className="d-none d-lg-block px-3 py-2"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                }}
              >
                <Reloj />
              </div>

              {/* Usuario */}
              <div className="dropdown">
                <button
                  className="btn border-0 shadow-lg dropdown-toggle d-flex align-items-center gap-2 px-4 py-3"
                  type="button"
                  data-bs-toggle="dropdown"
                  style={{
                    background: 'white',
                    color: estilos.colorPrincipal,
                    borderRadius: '15px',
                    fontWeight: '700',
                    fontSize: '1rem',
                  }}
                >
                  <div
                    className="d-flex align-items-center justify-content-center rounded-circle"
                    style={{
                      width: '35px',
                      height: '35px',
                      background: estilos.gradiente,
                      color: 'white',
                    }}
                  >
                    <i className="bi bi-person-fill"></i>
                  </div>
                  <span className="d-none d-md-inline">{usuario}</span>
                </button>
                <ul
                  className="dropdown-menu dropdown-menu-end border-0 shadow-lg mt-2"
                  style={{ borderRadius: '15px', minWidth: '200px' }}
                >
                  <li className="px-3 py-2">
                    <div className="text-muted small">Sesión activa</div>
                    <div className="fw-bold text-dark">{usuario}</div>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button
                      className="dropdown-item py-2 px-3 text-danger fw-semibold d-flex align-items-center gap-2"
                      onClick={logout}
                      style={{
                        borderRadius: '10px',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#dc354515';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                      }}
                    >
                      <i className="bi bi-box-arrow-right fs-5"></i>
                      Cerrar Sesión
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};
