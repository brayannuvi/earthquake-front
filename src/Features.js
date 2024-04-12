import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import { Button, FormControl, FormGroup, FormLabel, Table, Pagination } from 'react-bootstrap';
import ModalCommentForm from './ModalCommentForm';

const Features = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [filteredData, setFilteredData] = useState([]);
  const [magTypeFilter, setMagTypeFilter] = useState('');
  const [perPageFilter, setperPageFilter] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [selectedFeatureId, setSelectedFeatureId] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:3000/api/features');
        setData(response.data.data);
        setperPageFilter(response.data.pagination.per_page);
        setCurrentPage(response.data.pagination.current_page);
        setLoading(false);
      } catch (error) {
        alert('No se encontró la ruta especificada.');
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = data;
    if (magTypeFilter !== '') {
      filtered = filtered.filter(item => magTypeFilter.replace(/\s+/g, '').split(',').includes(item.attributes.mag_type));
    }
    setFilteredData(filtered);
  }, [data, magTypeFilter]);

  const handlePageClick = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  const indexOfLastItem = (currentPage + 1) * perPageFilter;
  const indexOfFirstItem = indexOfLastItem - perPageFilter;

  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const handleMagTypeInputChange = (event) => {
    setMagTypeFilter(event.target.value);
    setCurrentPage(0);
  };

  const handlePerPageChange = (event) => {
    if (event.target.value >= 1 && event.target.value <= 1000) {
      setperPageFilter(event.target.value);
      setCurrentPage(0);
    } else {
      alert('La cantidad de datos por página no puede ser inferior a 1 o superior a 1000.');
    }
  };

  const handleClose = () => setShowModal(false);
  const handleShow = (id) => {
    setSelectedFeatureId(id);
    setShowModal(true);
  }

  const handleSave = (comment) => {
    const postData = async () => {
      try {
        const response = await axios.post(`http://127.0.0.1:3000/api/features/${selectedFeatureId}/comments`, {
          body: comment
        });
        alert(response.data.message);
      } catch (error) {
        alert(error.response.data.error);
      }
    };
    
    postData();
  };

  return (
    <div className="m-3">
      <div className="row m-3">
        <FormGroup className='col-3'>
          <FormLabel htmlFor="magTypeFilterInput">MagType:</FormLabel>
          <FormControl
            type=""
            id="magTypeFilterInput"
            value={magTypeFilter}
            onChange={handleMagTypeInputChange}
          />
          <div className="form-text">Para más de un MagType digitarlos con , de por medio.</div>
        </FormGroup>
        <FormGroup className='col-3'>
          <FormLabel htmlFor="perPageFilterInput">Cantidad de datos por pagina:</FormLabel>
          <FormControl
            type="number"
            min={1}
            max={1000}
            id="perPageFilterInput"
            value={perPageFilter}
            onChange={handlePerPageChange}
          />
        </FormGroup>
      </div>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div>
          <Table striped>
            <thead>
              <tr>
                <th>Identificador externo</th>
                <th>Titulo</th>
                <th>Tiempo</th>
                <th>Tipo de magnitud</th>
                <th>Tsunami</th>
                <th>Url externa</th>
                <th className="text-center">Agregar comentario</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.attributes.external_id}</td>
                  <td>{item.attributes.title}</td>
                  <td>{new Date(parseInt(item.attributes.time)).toLocaleString()}</td>
                  <td>{item.attributes.mag_type}</td>
                  <td>{item.attributes.tsunami ? 'Sí' : 'No'}</td>
                  <td>{item.links.external_url}</td>
                  <td className="text-center">
                  <Button variant="primary" onClick={() => handleShow(item.id)}>
                    +
                  </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <ReactPaginate
            pageCount={Math.ceil(filteredData.length / perPageFilter)}
            onPageChange={handlePageClick}
            previousLabel={<Pagination.Prev/>}
            nextLabel={<Pagination.Next/>}
            marginPagesDisplayed={1}
            pageRangeDisplayed={2}
            containerClassName="pagination"
            activeClassName="active"
            breakLinkClassName="page-link"
            pageClassName="page-item"
            pageLinkClassName="page-link"

          />
          <ModalCommentForm show={showModal} handleClose={handleClose} onSave={handleSave}/>
        </div>
      )}
    </div>
  );
};

export default Features;