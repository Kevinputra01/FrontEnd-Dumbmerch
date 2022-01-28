import React, { useState, useEffect } from "react";
import { Container, Row, Col, Table, Button } from "react-bootstrap";
import { useHistory } from "react-router";

import NavbarAdmin from "../components/NavbarAdmin";
import DeleteData from "../components/modal/DeleteData";

import dataCategory from "../fakeData/category";

import imgEmpty from "../assets/empty.svg";

// Import useQuery and useMutation
import { useQuery, useMutation } from "react-query";

// Get API config
import { API } from "../config/api";

export default function CategoryAdmin() {
  const title = "Category admin";
  document.title = "DumbMerch | " + title;

  let history = useHistory();
  let api = API();

  // Variabel for delete category data
  const [idDelete, setIdDelete] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Fetching categories data from database
  let { data: categories, refetch } = useQuery("categoriesCache", async () => {
    const response = await api.get("/categories");
    return response.data;
  });

  const handleEdit = (id) => {
    history.push(`edit-category/${id}`);
  };

  // For get id category & show modal confirm delete data
  const handleDelete = (id) => {
    setIdDelete(id);
    handleShow();
  };

  // If confirm is true, execute delete data
  const deleteById = useMutation(async (id) => {
    try {
      const config = {
        method: "DELETE",
        headers: {
          Authorization: "Basic " + localStorage.token,
        },
      };
      await api.delete(`/category/${id}`, config);
      refetch();
    } catch (error) {
      console.log(error);
    }
  });

  useEffect(() => {
    if (confirmDelete) {
      // Close modal confirm delete data
      handleClose();
      // execute delete data by id function
      deleteById.mutate(idDelete);
      setConfirmDelete(null);
    }
  }, [confirmDelete]);

  const addCategory = () => {
    history.push("/add-category");
  };

  return (
    <>
      <NavbarAdmin title={title} />

      <Container className="py-5">
        <Row>
          <Col>
            <div className="text-header-category mb-4">List Category</div>
          </Col>
          <Col className="text-end">
            <Button
              onClick={addCategory}
              className="btn-dark"
              style={{ width: "100px" }}
            >
              Add
            </Button>
          </Col>
          <Col xs="12">
            {categories?.length != 0 ? (
              <Table striped hover size="lg" variant="dark">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Category Name</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {categories?.map((item, index) => (
                    <tr>
                      <td width="10%" className="align-middle">
                        {index + 1}
                      </td>
                      <td width="60%" className="align-middle">
                        {item.name}
                      </td>
                      <td width="30%">
                        <Button
                          onClick={() => {
                            handleEdit(item.id);
                          }}
                          className="btn-sm btn-success me-2"
                          style={{ width: "135px" }}
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => {
                            handleDelete(item.id);
                          }}
                          className="btn-sm btn-danger"
                          style={{ width: "135px" }}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <div className="text-center pt-5">
                <img
                  src={imgEmpty}
                  className="img-fluid"
                  style={{ width: "40%" }}
                />
                <div className="mt-3">No data category</div>
              </div>
            )}
          </Col>
        </Row>
      </Container>
      <DeleteData
        setConfirmDelete={setConfirmDelete}
        show={show}
        handleClose={handleClose}
      />
    </>
  );
}
