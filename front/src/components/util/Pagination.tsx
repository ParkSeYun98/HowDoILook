import styled from "styled-components";

//redux
import { useSelector, useDispatch } from "react-redux"; 
import {changePage} from "../../store/ChatSlice";


function Pagination({ total, limit, page, setPage }) {

  //redux 관리
  let state = useSelector((state:any)=>state.closet);
  let dispatch = useDispatch();

  const numPages = Math.ceil(total / limit);

  return (
    <>
      <Nav>
        <Button onClick={() => {dispatch(changePage(page-1)); setPage(page - 1)}} disabled={page === 1}>
          &lt;
        </Button>
        {Array(numPages)
          .fill()
          .map((_, i) => (
            <Button
              key={i + 1}
              onClick={() => {dispatch(changePage(i+1)); setPage(i + 1)}}
              aria-current={page === i + 1 ? "page" : null}
            >
              {i + 1}
            </Button>
          ))}
        <Button onClick={() => {dispatch(changePage(page+1));setPage(page + 1)}} disabled={page === numPages}>
          &gt;
        </Button>
      </Nav>
    </>
  );
}

const Nav = styled.nav`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  margin: 16px;
`;

const Button = styled.button`
  width : 40px;
  height : 40px;
  border: none;
  border-radius: 8px;
  padding: 8px;
  margin: 0;
  background: black;
  color: white;
  font-size: 1rem;

  &:hover {
    background: tomato;
    cursor: pointer;
    transform: translateY(-2px);
  }

  &[disabled] {
    background: grey;
    cursor: revert;
    transform: revert;
  }

  &[aria-current] {
    background: #4570F5;
    font-weight: bold;
    cursor: revert;
    transform: revert;
  }
`;

export default Pagination;