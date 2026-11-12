package org.zerock.mallapi.service;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.zerock.mallapi.domain.Todo;
import org.zerock.mallapi.dto.TodoDTO;
import org.zerock.mallapi.repository.TodoRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.zerock.mallapi.dto.PageRequestDTO;
import org.zerock.mallapi.dto.PageResponseDTO;

@Service
@Transactional
@Log4j2
@RequiredArgsConstructor
public class TodoServiceImpl implements TodoService {

    private final ModelMapper modelMapper;
    private final TodoRepository todoRepository;

    @Override
    public Long register(TodoDTO todoDTO) {
        Todo todo = modelMapper.map(todoDTO, Todo.class);
        Todo savedTodo = todoRepository.save(todo);
        return savedTodo.getTno();
    }

    @Override
    public TodoDTO get(Long tno) {
        Todo todo = todoRepository.findById(tno).orElseThrow();
        return modelMapper.map(todo, TodoDTO.class);
    }

    @Override
    public void modify(TodoDTO todoDTO) {
        Todo todo = todoRepository
            .findById(todoDTO.getTno())
            .orElseThrow();

        todo.changeTitle(todoDTO.getTitle());
        todo.changeDueDate(todoDTO.getDueDate());
        todo.changeComplete(todoDTO.isComplete());

        todoRepository.save(todo);
    }

    @Override
    public void remove(Long tno) {
        todoRepository.deleteById(tno);
    }
    @Override
    public PageResponseDTO<TodoDTO> list(PageRequestDTO pageRequestDTO) {

        Pageable pageable = PageRequest.of(
            pageRequestDTO.getPage() - 1,
            pageRequestDTO.getSize(),
            Sort.by("tno").descending()
        );

        Page<Todo> result = todoRepository.findAll(pageable);

        List<TodoDTO> dtoList = result.getContent().stream()
            .map(todo -> modelMapper.map(todo, TodoDTO.class))
            .collect(Collectors.toList());

        return PageResponseDTO.<TodoDTO>withAll()
            .dtoList(dtoList)
            .pageRequestDTO(pageRequestDTO)
            .totalCount(result.getTotalElements())
            .build();
    }
}